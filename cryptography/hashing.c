#include <stdio.h>
#include "sha256.h"
#include "hmac_sha256.h"
#include <node_api.h>
#include <stdlib.h>

napi_value HmacSha256Wrapper(napi_env env, napi_callback_info info){
    size_t argc = 4;
    napi_value args[4];

    napi_get_cb_info(env, info, &argc, args, NULL, NULL);

    if (argc < 4) {
        napi_throw_error(env, NULL, "4 args required");
        return NULL;
    }

    bool isBuffer;
    napi_status status = napi_is_buffer(env, args[0], &isBuffer);
    if (status != napi_ok || !isBuffer) {
        napi_throw_error(env, NULL, "Expected a Buffer (Binary input).");
        return NULL;
    }

    napi_valuetype messageLengthType;
    status = napi_typeof(env, args[1], &messageLengthType);
    if( messageLengthType != napi_number ){
        napi_throw_error(env, NULL, "Second argument must be a number.");
        return NULL;
    }

    status = napi_is_buffer(env, args[2], &isBuffer);
    if (status != napi_ok || !isBuffer) {
        napi_throw_error(env, NULL, "Expected a Buffer (Binary input).");
        return NULL;
    }

    napi_valuetype keyLengthType;
    status = napi_typeof(env, args[1], &keyLengthType);
    if( keyLengthType != napi_number ){
        napi_throw_error(env, NULL, "Second argument must be a number.");
        return NULL;
    }

    // extractanje binary podataka
    void* messageData;
    size_t mesageDataLen;
    status = napi_get_buffer_info(env, args[0], &messageData, &mesageDataLen);
    if (status != napi_ok) {
        napi_throw_error(env, NULL, "Failed to retrieve buffer info.");
        return NULL;
    }

     // Extract data length (convert number to size_t) => Js number je spremljen kao 64bit float => koristimo double
    double messageSize;
    status = napi_get_value_double(env, args[1], &messageSize);
    if (status != napi_ok || messageSize <= 0) {
        napi_throw_error(env, NULL, "Invalid data length.");
        return NULL;
    }
    size_t actualMessageSize = (size_t)messageSize;

    // extractanje binary podataka
    void* keyData;
    size_t keyDataLen;
    status = napi_get_buffer_info(env, args[2], &keyData, &keyDataLen);
    if (status != napi_ok) {
        napi_throw_error(env, NULL, "Failed to retrieve buffer info.");
        return NULL;
    }

     // Extract data length (convert number to size_t) => Js number je spremljen kao 64bit float => koristimo double
    double keySize;
    status = napi_get_value_double(env, args[3], &keySize);
    if (status != napi_ok || keySize <= 0) {
        napi_throw_error(env, NULL, "Invalid data length.");
        return NULL;
    }
    size_t actualKeySize = (size_t)keySize;

    uint8_t* hmacResult = hmac_sha256(messageData, actualMessageSize, keyData, actualKeySize);

    napi_value buffer;
    void* data;
    napi_create_buffer_copy(env, 32, hmacResult, &data, &buffer);
    free(hmacResult);
    return buffer;
}


// napi_value Sha256Wrapper(napi_env env, napi_callback_info info) {
//     size_t argc = 1;
//     napi_value args[1];
//     napi_get_cb_info(env, info, &argc, args, NULL, NULL);// popunimo argc sa argumentom koji predamo u js kodu kod poziva sha256()

//     if (argc < 1) {
//         napi_throw_error(env, NULL, "String argument required.");
//         return NULL;
//     }

//     size_t str_size;

//     napi_valuetype arg_type;
//     napi_status status = napi_typeof(env, args[0], &arg_type);
//     if (arg_type != napi_string) {
//         napi_throw_error(env, NULL, "Argument must be a string.");
//         return NULL;
//     }

//     napi_get_value_string_utf8(env, args[0], NULL, 0, &str_size);
//     char* input = (char*)malloc(str_size + 1);

//     napi_get_value_string_utf8(env, args[0], input, str_size + 1, NULL);
    
//     char* hash = sha256(input);
//     free(input);

//     napi_value buffer;
//     void* data;
//     napi_create_buffer_copy(env, 32, hash, &data, &buffer);
//     free(hash);

//     return buffer;
// }

napi_value Init(napi_env env, napi_value exports){
    napi_value sha256_func, hmac_sha256_func;
    // napi_create_function(env, NULL, 0, Sha256Wrapper, NULL, &sha256_func);
    // napi_set_named_property(env, exports, "sha256", sha256_func);

    napi_create_function(env, NULL, 0, HmacSha256Wrapper, NULL, &hmac_sha256_func);
    napi_set_named_property(env, exports, "hmac_sha256", hmac_sha256_func);
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init);