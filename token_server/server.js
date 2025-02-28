const { sha256 } = require('../sha256/build/Release/sha256addon');
const { createHash } = require('crypto');
let token;

const input = "InputMessageInputMessageInputMessageInputMessage";

console.log("SHA256 addon: ");

let startTime = performance.now();
let addon = sha256(input);
addon = sha256(input);
let endTime = performance.now();
console.log(`Call to doSomething took ${endTime - startTime} milliseconds`);

console.log("Crypto module: ");

startTime = performance.now();
let crypto = createHash('sha256').update(input).digest('hex')
endTime = performance.now();
console.log(`Call to doSomething took ${endTime - startTime} milliseconds`);

console.log(addon);
console.log(crypto);

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
