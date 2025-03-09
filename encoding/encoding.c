#include <stdio.h>
#include "base64url.h"
#include <node_api.h>
#include <stdlib.h>


napi_value base64urlEncodeWrapper(napi_env env, napi_callback_info info){
    size_t argc = 2;
    napi_value args[2];

    napi_get_cb_info(env, info, &argc, args, NULL, NULL);

    if (argc < 2) {
        napi_throw_error(env, NULL, "Two arguments required.");
        return NULL;
    }

    bool isBuffer;
    napi_status status = napi_is_buffer(env, args[0], &isBuffer);
    if (status != napi_ok || !isBuffer) {
        napi_throw_error(env, NULL, "Expected a Buffer (Binary input).");
        return NULL;
    }

    napi_valuetype argType;
    status = napi_typeof(env, args[1], &argType);
    if( argType != napi_number ){
        napi_throw_error(env, NULL, "Second argument must be a number.");
        return NULL;
    }

    // extractanje binary podataka
    void* binaryData;
    size_t dataLen;
    status = napi_get_buffer_info(env, args[0], &binaryData, &dataLen);
    if (status != napi_ok) {
        napi_throw_error(env, NULL, "Failed to retrieve buffer info.");
        return NULL;
    }
    
     // Extract data length (convert number to size_t) => Js number je spremljen kao 64bit float => koristimo double
     double inputLength;
     status = napi_get_value_double(env, args[1], &inputLength);
     if (status != napi_ok || inputLength <= 0) {
         napi_throw_error(env, NULL, "Invalid data length.");
         return NULL;
     }
     size_t actualLength = (size_t)inputLength;

    size_t outLen = 0;
    uint8_t* base64urlEncodingResult = base64urlEncode((uint8_t*)binaryData, actualLength, &outLen);
    
    napi_value result;
    status = napi_create_string_utf8(env, (uint8_t*)base64urlEncodingResult, outLen, &result);

    free(base64urlEncodingResult);

    return result;
}

napi_value base64urlEncodeStringWrapper(napi_env env, napi_callback_info info){
    size_t argc = 1;
    napi_value args[1];

    napi_get_cb_info(env, info, &argc, args, NULL, NULL);

    if (argc < 1) {
        napi_throw_error(env, NULL, "String argument required.");
        return NULL;
    }

    napi_valuetype argType;
    napi_status status = napi_typeof(env, args[0], &argType);
    if( argType != napi_string ){
        napi_throw_error(env, NULL, "First argument must be a string.");
        return NULL;
    }
    
    //extractanje inputa
    size_t inputSize;
    napi_get_value_string_utf8(env, args[0], NULL, 0, &inputSize);
    if(inputSize < 1){
        napi_throw_error(env, NULL, "Argument can not be an empty string.");
        return NULL;
    }
    char* input = (char*)malloc(inputSize + 1);
    napi_get_value_string_utf8(env, args[0], input, inputSize + 1, NULL);

    size_t outLen = 0;
    uint8_t* base64urlEncodingResult = base64urlEncodeString(input, &outLen);
    free(input);

    // Vracamo JS string
    uint8_t* outputString = (uint8_t*)malloc(outLen);
    for (int i = 0; i < outLen; i++) {
        sprintf(&outputString[i], "%c", base64urlEncodingResult[i]);
    }

    free(base64urlEncodingResult);
    napi_value result;
    napi_create_string_utf8(env, outputString, NAPI_AUTO_LENGTH, &result);
    free(outputString);
    return result;

}

napi_value Init(napi_env env, napi_value exports){
    napi_value base64urlEncodeString_func, base64urlEncode_func;

    napi_create_function(env, NULL, 0, base64urlEncodeStringWrapper, NULL, &base64urlEncodeString_func);
    napi_set_named_property(env, exports, "base64urlEncodeString", base64urlEncodeString_func);

    
    napi_create_function(env, NULL, 0, base64urlEncodeWrapper, NULL, &base64urlEncode_func);
    napi_set_named_property(env, exports, "base64urlEncode", base64urlEncode_func);

    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init);