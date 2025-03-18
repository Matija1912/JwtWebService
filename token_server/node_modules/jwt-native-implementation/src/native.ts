import path from 'path';
const { hmac_sha256, base64url_encode, base64url_decode } = require('node-gyp-build')(path.resolve(__dirname, ".."));

const native = {hmac_sha256,
            base64url_encode,
            base64url_decode}

export = native;