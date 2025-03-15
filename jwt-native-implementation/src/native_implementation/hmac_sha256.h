#ifndef HMAC_SHA256_H
#define HMAC_SHA256_H

#include <stdint.h>

uint8_t* hmac_sha256(uint8_t* message, size_t mesageLen, uint8_t*key, size_t keyLength);

#endif 