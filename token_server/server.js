const path = require('path');

// const header = {
//   "alg": "HS256",
//   "typ": "JWT"
// }

// const payload = {
//   "sub": "1234567890",
//   "name": "John Doe",
//   "iat": 1516239022
// }

// const ph = base64urlEncode(JSON.stringify(header)) + "." +  base64urlEncode(JSON.stringify(payload));

// const hmac = create_hmac_sha256("your-256-bit-secret").update(ph).digest("raw");
// const hmacBase64url = base64urlEncode(hmac); 
// console.log(ph + "." + hmacBase64url);

const createHmac = require('jwt_cryptography')

hmac = createHmac("Key")
console.log(hmac.update("Hello").digest("hEX"))