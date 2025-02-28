#include "sha256.h"
#include <stdio.h>

int main(int argc, char *argv[]) {
    if (argc != 2) {
        fprintf(stderr, "Usage: %s <string>\n", argv[0]);
        return 1;  // Return an error code
    }

    printf("%s\n", sha256(argv[1]));  // Print hash to stdout
    return 0;
}