const { createHash, createHmac, hash } = require('crypto');
const path = require('path');
const { create_hmac_sha256 } = require(path.join(__dirname, 'js_cryptography', 'cryptography.js'));

const hmac = create_hmac_sha256('Key').update('Hello');
console.log(hmac.digest('heX'));

// try{
//     token = jwt.signToken('asd', 'secret', 3);
// }catch(e){
//     console.log(e);
// }

// setTimeout(() => {
//     try{
//         console.log(jwt.verifyToken(token, 'secret'));
//     }catch(e){
//         console.log(e.message);
//     }
// }, 2000);
