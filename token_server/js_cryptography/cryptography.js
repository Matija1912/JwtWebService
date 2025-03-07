const path = require('path');
const { hmac_sha256 } = require(path.join(__dirname, '../../cryptography/build/Release/hashingaddon'));
const { HmacSha256 } = require(path.join(__dirname, './models/hmacSha256'));
const SecretKeyError = require(path.join(__dirname, './secretKeyError'));

module.exports = {
    create_hmac_sha256: (secretKey) => {
        if(secretKey){
            return new HmacSha256(secretKey, hmac_sha256);
        }else{
            throw new SecretKeyError("Secret key not provided", "error");
        }
    }
}