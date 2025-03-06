const hashing = require('../sha256/build/Release/hashingaddon');
const { createHash, createHmac, hash } = require('crypto');
let token;

const message = "hello";
const key = "key";

try{

    console.log("My implementation: ");
    let res = hashing.hmac_sha256(message, key);
    console.log(res);

    console.log("Crypto implementation: ");
    let bytes1 = createHmac('sha256', key).update(message).digest('hex');
    console.log(bytes1);

}catch(e){
    console.log(e.message);
}


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
