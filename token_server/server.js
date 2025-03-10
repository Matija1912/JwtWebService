const path = require('path');
const { create_hmac_sha256 } = require(path.join(__dirname, 'js_cryptography', 'cryptography.js'));
const { base64urlEncode, base64urlDecode } = require(path.join(__dirname, 'base64url', 'base64url.js'));

const dta = "Y\0a";
const enc = base64urlEncode(dta);
const dec = base64urlDecode(enc);

console.log(enc);
console.log(dec);

// const dec = base64urlDecode(enc);
//console.log(enc);

//WW9UaGlzIG15AA
//WW9UaGlzIG15XDA=