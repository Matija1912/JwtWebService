#include <node_api.h>
#include "hmac_sha256.h"
#include "sha256.h"
#include "base64url.h"
#include <stdlib.h>
#include "base64url.h"

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


static napi_value sha256_wrapper(napi_env env, napi_callback_info info){
    size_t argc = 2;
    napi_value args[2];

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

    uint8_t* sha256Result = sha256(messageData, actualMessageSize);

    napi_value buffer;
    void* data;
    napi_create_buffer_copy(env, 32, sha256Result, &data, &buffer);
    free(sha256Result);

    return buffer;
}

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

static napi_value base64urlEncodeWrapper(napi_env env, napi_callback_info info){
  size_t argc = 2;
  napi_value args[2];

  void* messageData;
  size_t mesageDataLen;

  double messageSize;

  NODE_API_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));
  NODE_API_CALL(env, napi_get_buffer_info(env, args[0], &messageData, &mesageDataLen));
  NODE_API_CALL(env, napi_get_value_double(env, args[1], &messageSize));
  size_t actualMessageSize = (size_t)messageSize;

  if(actualMessageSize < 1){
    napi_throw_error((env), NULL, "Empty buffers");  
  }

  size_t outLen = 0;
  uint8_t* base64urlEncodingResult = base64urlEncode((uint8_t*)messageData, actualMessageSize, &outLen);
  
  napi_value buffer;
  void* data;
  napi_create_buffer_copy(env, outLen, base64urlEncodingResult, &data, &buffer);
  free(base64urlEncodingResult);

  return buffer;
}

static napi_value base64urlDecodeWrapper(napi_env env, napi_callback_info info){
  size_t argc = 2;
  napi_value args[2];

  void* messageData;
  size_t mesageDataLen;

  double messageSize;

  NODE_API_CALL(env, napi_get_cb_info(env, info, &argc, args, NULL, NULL));
  NODE_API_CALL(env, napi_get_buffer_info(env, args[0], &messageData, &mesageDataLen));
  NODE_API_CALL(env, napi_get_value_double(env, args[1], &messageSize));
  size_t actualMessageSize = (size_t)messageSize;

  if(actualMessageSize < 1){
    napi_throw_error((env), NULL, "Empty buffers");  
  }

  size_t outLen = 0;
  uint8_t* base64urlDecodingResult = base64urlDecode((uint8_t*)messageData, actualMessageSize, &outLen);

  napi_value buffer;
  void* data;
  napi_create_buffer_copy(env, outLen, base64urlDecodingResult, &data, &buffer);
  free(base64urlDecodingResult);

  return buffer;
}

napi_value Init(napi_env env, napi_value exports){

  napi_status status;
  
  napi_property_descriptor desc[] = {
    {
      "sha256",
      NULL,
      sha256_wrapper,
      NULL,
      NULL,
      NULL,
      napi_writable | napi_enumerable | napi_configurable,
      NULL
    },
    {
      "hmac_sha256",
      NULL,
      hmac_sha256_wrapper,
      NULL,
      NULL,
      NULL,
      napi_writable | napi_enumerable | napi_configurable,
      NULL
    },
    {
      "base64url_encode",
      NULL,
      base64urlEncodeWrapper,
      NULL,
      NULL,
      NULL,
      napi_writable | napi_enumerable | napi_configurable,
      NULL
    },
    {
      "base64url_decode",
      NULL,
      base64urlDecodeWrapper,
      NULL,
      NULL,
      NULL,
      napi_writable | napi_enumerable | napi_configurable,
      NULL
    }
  };
  status = napi_define_properties(env, exports, sizeof(desc) / sizeof(desc[0]), desc);

  if (status != napi_ok) {
    napi_throw_error(env, NULL, "Failed to define properties");
    return NULL;
  }

  // napi_value result;
  // NODE_API_CALL(env, napi_create_object(env, &result));

  // napi_value exported_function;
  // NODE_API_CALL(env, napi_create_function(env, NULL, 0, hmac_sha256_wrapper, NULL, &exported_function));

  // NODE_API_CALL(env, napi_set_named_property(env, exports, "hmac_sha256", exported_function));

  return exports;

}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init);