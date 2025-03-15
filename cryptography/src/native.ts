import path from 'path';
const {hmac_sha256} = require('node-gyp-build')(path.resolve(__dirname, ".."));

export default hmac_sha256;