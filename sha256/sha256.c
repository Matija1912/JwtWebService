#include <stdio.h>
#include <stdint.h>
#include <string.h>
#include <stdlib.h>
#include <node_api.h>

//Desna rotacija (kruzna)
#define ROTR(n, x) ((x >> n) | (x << (32 - n))) //pomicemo desno i popunimo s lieve strane (| (x << (32 - n)))

uint32_t SHA265_HASH_VALUES_INITIAL[8] = {
    0x6a09e667, 0xbb67ae85, 0x3c6ef372, 0xa54ff53a, 
    0x510e527f, 0x9b05688c, 0x1f83d9ab, 0x5be0cd19
};

uint32_t SHA265_HASH_VALUES[8];

const uint32_t SHA265_ROUND_CONSTANTS[64] = {
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
};

char* sha256(char* message);
void compression(uint32_t** block_array, int blockNumber);
void expandMessageSchedule(uint32_t** blockArray, uint8_t **paddedMessage, int blockNumber);
void preprocessMessage(const uint8_t *input, size_t len, uint8_t **paddedMessage, size_t *paddedLen);

void compression(uint32_t** block_array, int blockNumber){
    memcpy(SHA265_HASH_VALUES, SHA265_HASH_VALUES_INITIAL, sizeof(SHA265_HASH_VALUES_INITIAL));
    for(int i = 0; i < blockNumber; i++){
        uint32_t a = SHA265_HASH_VALUES[0];
        uint32_t b = SHA265_HASH_VALUES[1];
        uint32_t c = SHA265_HASH_VALUES[2];
        uint32_t d = SHA265_HASH_VALUES[3];
        uint32_t e = SHA265_HASH_VALUES[4];
        uint32_t f = SHA265_HASH_VALUES[5];
        uint32_t g = SHA265_HASH_VALUES[6];
        uint32_t h = SHA265_HASH_VALUES[7];

        for(int j = 0; j < 64; j++){
            uint32_t s1 = ROTR(6, e) ^ ROTR(11, e) ^ ROTR(25, e);
            uint32_t choice = (e & f) ^ ((~e) & g);
            uint32_t temp1 = h + s1 + choice + SHA265_ROUND_CONSTANTS[j] + block_array[i][j];
            uint32_t s0 = ROTR(2, a) ^ ROTR(13, a) ^ ROTR(22, a);
            uint32_t majority = (a & b) ^ (a & c) ^ (b & c);  
            uint32_t temp2 = s0 + majority;
            h = g;
            g = f; 
            f = e;
            e = d + temp1;
            d = c;
            c = b;
            b = a;
            a = temp1 + temp2;

        }

        SHA265_HASH_VALUES[0] += a;
        SHA265_HASH_VALUES[1] += b;
        SHA265_HASH_VALUES[2] += c;
        SHA265_HASH_VALUES[3] += d;
        SHA265_HASH_VALUES[4] += e; 
        SHA265_HASH_VALUES[5] += f;
        SHA265_HASH_VALUES[6] += g;
        SHA265_HASH_VALUES[7] += h;

    }

}

void expandMessageSchedule(uint32_t** blockArray, uint8_t **paddedMessage, int blockNumber){
    
    uint32_t W[64] = {0};

    for(int j = 0; j < blockNumber; j++){

        for(int i = 0; i < 16; i++){
            W[i] = ((*paddedMessage)[(j * 64) + (i * 4)] << 24) | ((*paddedMessage)[(j * 64) + (i * 4) + 1] << 16) | ((*paddedMessage)[(j * 64) + (i * 4) + 2] << 8) | ((*paddedMessage)[(j * 64) + (i * 4) + 3]); // Konverzija u Big Endian.
        }

        for(int i = 16; i < 64; i++){
            uint32_t s0 = ROTR(7, W[i - 15]) ^ ROTR(18, W[i - 15]) ^ (W[i - 15] >> 3);
            uint32_t s1 = ROTR(17, W[i - 2]) ^ ROTR(19, W[i - 2]) ^ (W[i - 2] >> 10);
            W[i] = W[i - 16] + s0 + W[i - 7] + s1;
        }

        memcpy(blockArray[j], W, 64 * sizeof(uint32_t));

        // printf("\nExpanded Message Schedule for Block %d:\n", j + 1);
        // for (int i = 0; i < 64; i++) {
        //     printf("W[%2d] = 0x%08x  ", i, W[i]);  // Print hexadecimal
        //     printBinary(W[i]);  // Print binary representation
        //     printf("\n");
        // }

    }

    // for(int i = 0; i < 16; i++){
    //     W[i] = ((*paddedMessage)[i * 4] << 24) | ((*paddedMessage)[i * 4 + 1] << 16) | ((*paddedMessage)[i * 4 + 2] << 8) | ((*paddedMessage)[i * 4 + 3]); // Konverzija u Big Endian.
    // }

    /*
    For i from w[16…63]:
    s0 = (w[i-15] rightrotate 7) xor (w[i-15] rightrotate 18) xor (w[i-15] rightshift 3)
    s1 = (w[i- 2] rightrotate 17) xor (w[i- 2] rightrotate 19) xor (w[i- 2] rightshift 10)
    w[i] = w[i-16] + s0 + w[i-7] + s1
    */

    // for(int i = 16; i < 64; i++){
    //     uint32_t s0 = ROTR(7, W[i - 15]) ^ ROTR(18, W[i - 15]) ^ (W[i - 15] >> 3);
    //     uint32_t s1 = ROTR(17, W[i - 2]) ^ ROTR(19, W[i - 2]) ^ (W[i - 2] >> 10);
    //     W[i] = W[i - 16] + s0 + W[i - 7] + s1;
    // }

}

void preprocessMessage(const uint8_t *input, size_t len, uint8_t **paddedMessage, size_t *paddedLen){
    size_t newLen;

    newLen = len + 1; //Dodavanje jednog bajta na kraj (povecamo len).
    while(newLen % 64 != 56){ //Dodavanje nula (8 bitova) sve do zadnja 8 bajta (64 bita) koje cemo koristiti kasnije. (PADDING)
        newLen += 1;
    }
    *paddedLen = newLen + 8; //dodano zadnjih 8 bajta
    *paddedMessage = (uint8_t*)calloc(*paddedLen, 1); //Alocirano polje nula
    memcpy(*paddedMessage, input, len); //Kopiramo pocetni string u novo alocirano polje nula
    *(*paddedMessage + len) = 0x80; //Isto kao (*paddedMessage)[len] = 0x80; (DA ME NE ZBUNI KASNIJE!)

    uint64_t bitLen = len * 8; //Ovdje racunamo duljinu stringa bitova (mnozimo sa 8 jer u c-u radimo sa cijelim bajtom a ne pojedinacnim bitovima)
    for(int i = 0; i < 8 ; i++){
        (*paddedMessage)[newLen + i] = (bitLen >> (56 - 8 * i)) & 0xFF; //Osigurava big endian oblik duljine poruke (u slucaju da racunalo koristi LE arhitekturu), & 0xFF osigurava da nema prethodnih jedinica.
    }
}

char* sha256(char* message){

    uint8_t *paddedMessage = NULL;
    size_t paddedLen;

    preprocessMessage((uint8_t*)message, strlen(message), &paddedMessage, &paddedLen);

    //Polje blokova(svaki blok se prosiruje u 64 32-bitne rijeci) i alokacija svakog bloka u for petlji
    uint32_t** block_array = (uint32_t** )calloc((paddedLen  / 64), sizeof(uint32_t*));
    for (size_t i = 0; i < (paddedLen / 64); i++) {
        block_array[i] = (uint32_t*)calloc(64, sizeof(uint32_t));  // Allocate 64 words for each block
    }

    expandMessageSchedule(block_array, &paddedMessage, (paddedLen  / 64));

    compression(block_array, (paddedLen  / 64));

    free(block_array);

    free(paddedMessage);
    
    char* hash_output = (char*)malloc(65);

    snprintf(hash_output, 65, "%08x%08x%08x%08x%08x%08x%08x%08x",
             SHA265_HASH_VALUES[0], SHA265_HASH_VALUES[1], SHA265_HASH_VALUES[2],
             SHA265_HASH_VALUES[3], SHA265_HASH_VALUES[4], SHA265_HASH_VALUES[5],
             SHA265_HASH_VALUES[6], SHA265_HASH_VALUES[7]);

             

    return hash_output;
}

napi_value Sha256Wrapper(napi_env env, napi_callback_info info) {
    size_t argc = 1;
    napi_value args[1];
    napi_get_cb_info(env, info, &argc, args, NULL, NULL);

    if (argc < 1) {
        napi_throw_error(env, NULL, "String argument required.");
        return NULL;
    }

    size_t str_size;
    napi_get_value_string_utf8(env, args[0], NULL, 0, &str_size);
    char* input = (char*)malloc(str_size + 1);
    napi_get_value_string_utf8(env, args[0], input, str_size + 1, NULL);

    char* hash = sha256(input);
    free(input);

    napi_value result;
    napi_create_string_utf8(env, hash, NAPI_AUTO_LENGTH, &result);
    free(hash);

    return result;
}

napi_value Init(napi_env env, napi_value exports){
    napi_value sha256_func;
    napi_create_function(env, NULL, 0, Sha256Wrapper, NULL, &sha256_func);
    napi_set_named_property(env, exports, "sha256", sha256_func);
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init);