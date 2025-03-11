const path = require('path');
const { create_hmac_sha256 } = require(path.join(__dirname, 'js_cryptography', 'cryptography.js'));
const { base64urlEncode, base64urlDecode } = require(path.join(__dirname, 'base64url', 'base64url.js'));

const header = {
  "alg": "HS256",
  "typ": "JWT"
}

const payload = {
  "sub": "1234567890",
  "name": "John Doe",
  "iat": 1516239022
}

const ph = base64urlEncode(JSON.stringify(header)) + "." +  base64urlEncode(JSON.stringify(payload));

const hmac = create_hmac_sha256("your-256-bit-secret").update(ph).digest("raw");
const hmacBase64url = base64urlEncode(hmac); 
console.log(ph + "." + hmacBase64url);