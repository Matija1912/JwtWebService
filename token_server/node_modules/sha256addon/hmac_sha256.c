#include <stdio.h>
#include <string.h>
#include <stdlib.h>
#include "sha256.h"

#define SHA256_BLOCK_SIZE 64 //definiramo velicinu bloka (za sha256 to je 512 bitova ili 64 bajta)

uint8_t* hmac_sha256(uint8_t* message, uint8_t* key);
uint8_t* process(uint8_t* message, uint8_t* innerPadding, size_t innerPaddingLen, uint8_t* outerPadding, size_t outerPaddingLen);

uint8_t* hmac_sha256(uint8_t* message, uint8_t*key){

    size_t keyLength = strlen(key);
    uint8_t innerPadding[SHA256_BLOCK_SIZE];
    uint8_t outerPadding[SHA256_BLOCK_SIZE];
    memset(innerPadding, 0x36, SHA256_BLOCK_SIZE); //popunimo polje od 512 bitova (64 bajta) sa 0x36 (hex vrijednost 36) => inner padding
    memset(outerPadding, 0x5c, SHA256_BLOCK_SIZE); //popunimo polje od 512 bitova (64 bajta) sa 0x5c (hex vrijednost 5c) => outer padding

    uint8_t k0[64] = {0x0};

    //Tri slucaja: secret key je manji od velicine bloka SHA256, secret key je iste velicine kao SHA256 blok i secret key je veci od SHA256 bloka
    if(keyLength < SHA256_BLOCK_SIZE){
        memcpy(k0, key, keyLength);
        
        for(int i = 0; i < SHA256_BLOCK_SIZE; i++){
            innerPadding[i] ^= k0[i];
            outerPadding[i] ^= k0[i];
        }


    }else if(keyLength == SHA256_BLOCK_SIZE){
        memcpy(k0, key, keyLength);
        for(int i = 0; i < SHA256_BLOCK_SIZE; i++){
            innerPadding[i] ^= k0[i];
            outerPadding[i] ^= k0[i];
        }
    }

    else if(keyLength > SHA256_BLOCK_SIZE){
        uint8_t* hashedKey = sha256(key, keyLength);

        memcpy(k0, hashedKey, 32);
        free(hashedKey);

        for(int i = 0; i < SHA256_BLOCK_SIZE; i++){
            innerPadding[i] ^= k0[i];
            outerPadding[i] ^= k0[i];
        }

    }

    

    return process(message ,innerPadding, sizeof(innerPadding), outerPadding, sizeof(outerPadding));

}

uint8_t* process(uint8_t* message, uint8_t* innerPadding, size_t innerPaddingLen, uint8_t* outerPadding, size_t outerPaddingLen){

    size_t messageLen = strlen(message);

    size_t newLen = innerPaddingLen + messageLen;
    uint8_t* ipadApendedWithMessage = (uint8_t*)malloc(newLen);

    memcpy(ipadApendedWithMessage, innerPadding, innerPaddingLen);
    memcpy(ipadApendedWithMessage + innerPaddingLen, message, messageLen);

    size_t length = innerPaddingLen + messageLen;
    uint8_t* hashResult = sha256(ipadApendedWithMessage, length);

    free(ipadApendedWithMessage);

    size_t length1 = outerPaddingLen + 32;
    uint8_t* appendAll = (uint8_t*)malloc(length1); 

    memcpy(appendAll, outerPadding, outerPaddingLen);
    memcpy(appendAll + outerPaddingLen, hashResult, 32);
    free(hashResult);

    uint8_t* shaRes = sha256(appendAll, length1); 
    free(appendAll);

    return shaRes;

}
 
int main(){

    uint8_t* res = hmac_sha256("Hello", "Key"); 
    for(int i = 0; i < 32; i++){
        printf("%02x", res[i]);
    }

    return 0;
}