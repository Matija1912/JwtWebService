#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <stdlib.h>

#define SIX_BIT_MASK 0b00111111

static const char base64EncodingTable[] = {
    'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
    'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
    'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
    'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
    'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
    'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
    'w', 'x', 'y', 'z', '0', '1', '2', '3',
    '4', '5', '6', '7', '8', '9', '-', '_'
};

uint8_t* base64urlEncode(uint8_t* byteStream, size_t inputSize, size_t* outLen){

    if(!byteStream || inputSize == 0){
        *outLen = 0;
        return NULL;
    }

    size_t iterations =  ((inputSize-1) / 3) + 1;  
    
    //uint8_t output[iterations * 4]; // output base64 i base64url encodinga je uvijek 4*n(n je iz skupa prirodnih brojeva) bajta. Ako imamo ulaz 1 char => 1 bajt, output je zapravo 2 bajta + 2 bajta paddinga, ako imamo ulaz 2 charactera izlaz je 3 bajta + 1 bajt paddinga.
    uint8_t* out = (uint8_t*)malloc(iterations * 4 + 1);


    size_t index = 0;
    for(size_t i = 0; i < iterations; i++){
        
        uint32_t combined = (byteStream[i * 3] << 16); 
        if((i * 3 + 1) < inputSize) combined = combined | (byteStream[i * 3 + 1] << 8);
        if((i * 3 + 2) < inputSize) combined = combined | byteStream[i * 3 + 2];

        out[(index++)] = base64EncodingTable[SIX_BIT_MASK & (combined >> 18)];
        out[(index++)] = base64EncodingTable[SIX_BIT_MASK & (combined >> 12)];

        if((i * 3 + 1) < inputSize){
            out[(index++)] = base64EncodingTable[SIX_BIT_MASK & (combined >> 6)];
        }
        if((i * 3 + 2) < inputSize){
            out[(index++)] = base64EncodingTable[SIX_BIT_MASK & (combined)];
   
        }

        // out[i * 4] = base64EncodingTable[SIX_BIT_MASK & (combined >> 18)];
        // out[i * 4 + 1] = base64EncodingTable[SIX_BIT_MASK & (combined >> 12)];

        // if((i * 3 + 1) < len){
        //     out[i * 4 + 2] = base64EncodingTable[SIX_BIT_MASK & (combined >> 6)];
        // }
        // if((i * 3 + 2) < len){
        //     out[i * 4 + 3] = base64EncodingTable[SIX_BIT_MASK & (combined)];
   
        // }

    }

    out[index] = '\0';
    *outLen = index;
    return out;

}

uint8_t* base64urlEncodeString(char* byteStream, size_t* outLen){

    //byteStream mora biti string => zabranimo unos bilo kojeg drugog tipa u wrapper funkciji koji bi rezultirao neocekivanim ponasanjem encodera. Tehnicki parametar mozemo promjeniti u uint8_t* jer cemo uvijek predati string na njegovo mjesto tako da ce uvijek zadnji element polja biti \0
    size_t len = strlen(byteStream);

    size_t iterations =  ((len-1) / 3) + 1;  
    
    //uint8_t output[iterations * 4]; // output base64 i base64url encodinga je uvijek 4*n(n je iz skupa prirodnih brojeva) bajta. Ako imamo ulaz 1 char => 1 bajt, output je zapravo 2 bajta + 2 bajta paddinga, ako imamo ulaz 2 charactera izlaz je 3 bajta + 1 bajt paddinga.
    uint8_t* out = (uint8_t*)malloc(iterations * 4 + 1);


    size_t index = 0;
    for(size_t i = 0; i < iterations; i++){
        //uint32_t combined = 0x00 | ((byteStream[i * 3] << 16) | (byteStream[(i * 3) + 1] << 8) | byteStream[(i * 3) + 2]);

        uint32_t combined = (byteStream[i * 3] << 16);
        if((i * 3 + 1) < len) combined = combined | (byteStream[i * 3 + 1] << 8);
        if((i * 3 + 2) < len) combined = combined | byteStream[i * 3 + 2];

        out[(index++)] = base64EncodingTable[SIX_BIT_MASK & (combined >> 18)];
        out[(index++)] = base64EncodingTable[SIX_BIT_MASK & (combined >> 12)];

        if((i * 3 + 1) < len){
            out[(index++)] = base64EncodingTable[SIX_BIT_MASK & (combined >> 6)];
        }
        if((i * 3 + 2) < len){
            out[(index++)] = base64EncodingTable[SIX_BIT_MASK & (combined)];
   
        }

        // out[i * 4] = base64EncodingTable[SIX_BIT_MASK & (combined >> 18)];
        // out[i * 4 + 1] = base64EncodingTable[SIX_BIT_MASK & (combined >> 12)];

        // if((i * 3 + 1) < len){
        //     out[i * 4 + 2] = base64EncodingTable[SIX_BIT_MASK & (combined >> 6)];
        // }
        // if((i * 3 + 2) < len){
        //     out[i * 4 + 3] = base64EncodingTable[SIX_BIT_MASK & (combined)];
   
        // }

    }

    out[index] = '\0';
    *outLen = index;
    return out;

}