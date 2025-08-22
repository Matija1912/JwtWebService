import path from 'path';
const { sha256, hmac_sha256, base64url_encode, base64url_decode } = require('node-gyp-build')(path.resolve(__dirname, ".."));

const native = {
    sha256,
    hmac_sha256,
    base64url_encode,
    base64url_decode
}

export = native;