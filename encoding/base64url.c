#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <stdlib.h>

#define SIX_BIT_MASK 0b00111111
#define INVALID_CHARACTER 64


static const unsigned char base64DecodingTable[] = {
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 62, 64, 64, 52, 53,
    54, 55, 56, 57, 58, 59, 60, 61, 64, 64, 64, 64, 64, 64, 64,  0,  1,  2,  3,  4,  5,  6,  7,  8,  9,
    10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 64, 64, 64, 64, 63, 64, 26, 27, 28,
    29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64, 64,
    64, 64, 64, 64, 64, 64
};

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

uint8_t* base64urlEncode(const uint8_t* byteStream, size_t inputSize, size_t* outLen){

    if(!byteStream || inputSize == 0){
        *outLen = 0;
        return NULL;
    }

    size_t iterations =  ((inputSize-1) / 3) + 1;  
    
    //uint8_t out[iterations * 4]; // output base64 i base64url encodinga je uvijek 4*n(n je iz skupa prirodnih brojeva) bajta. Ako imamo ulaz 1 char => 1 bajt, output je zapravo 2 bajta + 2 bajta paddinga, ako imamo ulaz 2 charactera izlaz je 3 bajta + 1 bajt paddinga.
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

    *outLen = index;
    return out;

}

//00010100 00110111 00010101 00101110

uint8_t* base64urlDecode(uint8_t* input, size_t inSize){


    //PRIMJER
    // Input character bytes: S          u           n
    // ASCII Hex value:       0x53       0x75        0x6E
    // Binary                 01010011   01110101    01101110
    // 6bit parts:            010100 110111 010101 101110
    // Decimal (index)values: 20     55     21     46
    // Base64 characters:     U      3      V      u

    int blocksOfFourBytes = ((inSize - 1) / 3) + 1;
    size_t outputSize = (inSize / 4) * 3;
    //Ako zadnji blok od 4 bajta nije u potpunosti pun. Rezultat encodanja: c3Nzc3M= (inSize % 4 == 3) input: "sssss" => "ssss" + "s". sto tako i za slucaj (inSize % 4 == 2)
    if (inSize % 4 == 2) outputSize += 1;
    if (inSize % 4 == 3) outputSize += 2;
    uint8_t* output = (uint8_t*)malloc(outputSize + 1); //Originalna poruka je 3/4 encodane poruke => +1 za \0 jer decodamo u string

    //blokovi po 4
    for(int i = 0; i < blocksOfFourBytes; i++){

        uint32_t temp = 0x0;
    
        uint8_t character1 = base64DecodingTable[input[(i * 4)]] & SIX_BIT_MASK; 
        uint8_t character2 = base64DecodingTable[input[(i * 4) + 1]] & SIX_BIT_MASK;

        uint8_t character3 = (i * 4 + 2 < inSize) ? base64DecodingTable[input[(i * 4) + 2]] & SIX_BIT_MASK : 0;
        uint8_t character4 = (i * 4 + 3 < inSize) ? base64DecodingTable[input[(i * 4) + 3]] & SIX_BIT_MASK : 0;

        // uint8_t character3 = base64DecodingTable[input[(i * 4) + 2]] & SIX_BIT_MASK;
        // uint8_t character4 = base64DecodingTable[input[(i * 4) + 3]] & SIX_BIT_MASK;
    
        temp |= (character1 << 18);
        temp |= (character2 << 12);
        temp |= (character3 << 6);
        temp |= (character4);

        // temp |= (character1 << 26);
        // temp |= (character2 << 20);
        // temp |= (character3 << 14);
        // temp |= (character4 << 8);
        // temp = temp >> 8;
    
        output[(i * 3)]  = (temp >> 16) & 0xFF;
        if (i * 4 + 2 < inSize) output[(i * 3) + 1] = (temp >> 8) & 0xFF;
        if (i * 4 + 3 < inSize) output[(i * 3) + 2] = temp & 0xFF;

    }

    output[outputSize] = '\0';
    return output;

}

int main(){

    size_t outLen;
    uint8_t data[] = {'s'};

    uint8_t* encoded = base64urlEncode(data, sizeof(data), &outLen);

    uint8_t* decoded = base64urlDecode(encoded, outLen);

    printf("%s", decoded);

    return 0;
}