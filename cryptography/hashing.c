#include <stdio.h>
#include "sha256.h"
#include "hmac_sha256.h"
#include <node_api.h>
#include <stdlib.h>

napi_value HmacSha256Wrapper(napi_env env, napi_callback_info info){
    size_t argc = 2;
    napi_value args[2];

    napi_get_cb_info(env, info, &argc, args, NULL, NULL);

    if (argc < 2) {
        napi_throw_error(env, NULL, "String argument required.");
        return NULL;
    }

    napi_valuetype argType1, argType2;
    napi_status status = napi_typeof(env, args[0], &argType1);
    if( argType1 != napi_string ){
        napi_throw_error(env, NULL, "First argument must be a string.");
        return NULL;
    }

    status = napi_typeof(env, args[1], &argType2);
    if( argType2 != napi_string ){
        napi_throw_error(env, NULL, "Second argument must be a string."); // Vracamo exception u JS exception sistem
        return NULL;
    }
    
    //extractanje message i key parametra
    size_t messageSize;
    napi_get_value_string_utf8(env, args[0], NULL, 0, &messageSize);
    char* message = (char*)malloc(messageSize + 1);
    napi_get_value_string_utf8(env, args[0], message, messageSize + 1, NULL);

    size_t keySize;
    napi_get_value_string_utf8(env, args[1], NULL, 0, &keySize);
    char* key = (char*)malloc(keySize + 1);
    napi_get_value_string_utf8(env, args[1], key, keySize + 1, NULL);


    uint8_t* hmacResult = hmac_sha256(message, key);
    free(message);
    free(key);

    // Vracamo JS string (Binarni rezultatu => hex string)
    // char hexString[65];  // 32 bajta (2 chara za prikaz hex vrijednosti  =>  %02x) + null (\0)
    // for (int i = 0; i < 32; i++) {
    //     sprintf(&hexString[i * 2], "%02x", hmacResult[i]);
    // }
    // hexString[64] = '\0';

    // free(hmacResult);
    // // napi_value result;
    // napi_create_string_utf8(env, hexString, NAPI_AUTO_LENGTH, &result);
    // return result;

    // Vracamo binarno
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