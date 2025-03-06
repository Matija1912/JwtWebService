#ifndef HMAC_SHA256_H
#define HMAC_SHA256_H

#include <stdint.h>

uint8_t* hmac_sha256(char* message, char* key);

#endif 