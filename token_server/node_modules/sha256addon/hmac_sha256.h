#ifndef HMAC_SHA256_H
#define HMAC_SHA256_H

#include <stdint.h>

uint8_t* hmac_sha256(uint8_t* message, uint8_t*key);

#endif 