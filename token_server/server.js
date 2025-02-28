const { sha256 } = require('../sha256/build/Release/sha256addon');
let token;

console.log(sha256('hello worldhello world'))
let inp = 'hello world';
for(let i = 0; i < 4; i++){
    console.log("Input: " + inp);
    console.log(sha256(inp));
    inp += 'hello world'
    inp = inp.replace(/[^\x20-\x7E]/g, ''); 
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
