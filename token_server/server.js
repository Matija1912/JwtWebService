const { sha256 } = require('../sha256/build/Release/sha256addon');
let token;

console.log(sha256("hello world"))
console.log(sha256("hello worlasdd"))


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
