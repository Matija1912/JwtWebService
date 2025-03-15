#include <node_api.h>
#include "hmac_sha256.h"
#include <stdlib.h>

#define NODE_API_CALL(env, call)                                  \
  do {                                                            \
    napi_status status = (call);                                  \
    if (status != napi_ok) {                                      \
      const napi_extended_error_info* error_info = NULL;          \
      napi_get_last_error_info((env), &error_info);               \
      const char* err_message = error_info->error_message;        \
      bool is_pending;                                            \
      napi_is_exception_pending((env), &is_pending);              \
      if (!is_pending) {                                          \
        const char* message = (err_message == NULL)               \
            ? "empty error message"                               \
            : err_message;                                        \
        napi_throw_error((env), NULL, message);                   \
      }                                                           \
      return NULL;                                                \
    }                                                             \
  } while(0)

static napi_value hmac_sha256_wrapper(napi_env env, napi_callback_info info){
    size_t argc = 4;
    napi_value args[4];

    void* messageData;
    size_t mesageDataLen;

    double messageSize;

    void* keyData;
    size_t keyDataLen;

    double keySize;


    NODE_API_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));
    NODE_API_CALL(env, napi_get_buffer_info(env, args[0], &messageData, &mesageDataLen));
    NODE_API_CALL(env, napi_get_value_double(env, args[1], &messageSize));
    size_t actualMessageSize = (size_t)messageSize;
    NODE_API_CALL(env, napi_get_buffer_info(env, args[2], &keyData, &keyDataLen));
    NODE_API_CALL(env, napi_get_value_double(env, args[3], &keySize));
    size_t actualKeySize = (size_t)keySize;

    if(actualKeySize < 1 || actualMessageSize < 1){
      napi_throw_error((env), NULL, "Empty buffers");  
    }

    uint8_t* hmacResult = hmac_sha256(messageData, actualMessageSize, keyData, actualKeySize);

    napi_value buffer;
    void* data;
    napi_create_buffer_copy(env, 32, hmacResult, &data, &buffer);
    free(hmacResult);

    return buffer;
}

napi_value Init(napi_env env, napi_value exports){

    napi_status status;
    
    napi_property_descriptor desc = {
      "hmac_sha256",
      NULL,
      hmac_sha256_wrapper,
      NULL,
      NULL,
      NULL,
      napi_writable | napi_enumerable | napi_configurable,
      NULL
    };
    status = napi_define_properties(env, exports, 1, &desc);
    // napi_value result;
    // NODE_API_CALL(env, napi_create_object(env, &result));

    // napi_value exported_function;
    // NODE_API_CALL(env, napi_create_function(env, NULL, 0, hmac_sha256_wrapper, NULL, &exported_function));

    // NODE_API_CALL(env, napi_set_named_property(env, exports, "hmac_sha256", exported_function));

    return exports;

}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init);