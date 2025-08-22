#ifndef BASE64URL_H
#define BASE64URL_H

uint8_t* base64urlEncode(const uint8_t* byteStream, size_t inputSize, size_t* outLen);
uint8_t* base64urlDecode(uint8_t* input, size_t inSize, size_t* outSize);

#endif 
