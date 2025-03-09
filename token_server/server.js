const path = require('path');
const { create_hmac_sha256 } = require(path.join(__dirname, 'js_cryptography', 'cryptography.js'));
const { base64urlEncode, base64urlEncodeString, base64urlDecode } = require(path.join(__dirname, 'base64url', 'base64url.js'));

const header = {
    "alg": "HS256",
    "typ": "JWT"
  };

const payload = {
    "sub": "1234567890",
    "name": "John Doe",
    "iat": 1516239022
  };
const secret = 'your-256-bit-secret';

const signature = create_hmac_sha256('your-256-bit-secret').update(base64urlEncodeString(JSON.stringify(header)) + '.' + base64urlEncodeString(JSON.stringify(payload))).digest('raw');
const tokenSignature = base64urlEncode(signature, signature.length);



//SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c
//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c