const jwt_native = require('jwt-native-implementation');
const jwt = require('jsonwebtoken');

const implementation = process.argv[2];
const repeatNumber = Number(process.argv[3]);

const payload = {
    name: "randomName",
    lastname: "randomLastname",
    username: "randomUsername",
    email: "randomEmail",
    id: 1,
    role: true
}

const secret = "randomsecretrandomsecretrandomsecret";

function measureMemUsage(implementation, repeatNumber , fn){
    global.gc(); // --expose-gc => prisilimo v8 da pocisti nekoristenu memoriju, 

    const memoryStart = process.memoryUsage().heapUsed;
    const startTime = performance.now();

    fn(implementation, repeatNumber);

    const endTime = performance.now();
    const memoryEnd = process.memoryUsage().heapUsed;

    console.log(`${implementation} => execution time: ${(endTime - startTime).toFixed(4)} ms`);
    console.log(`${implementation} => Memory used: ${(memoryEnd - memoryStart) / 1024} KB`);
}


const test = (implementation, repeatNumber) => {
    if(implementation === 'jwt-native'){
        for (let i = 0; i < repeatNumber; i++) {
            const token = jwt_native.sign(payload, secret, {algorithm: "HS256"});
            jwt_native.verify(token, "randomsecretrandomsecretrandomsecret");

        }
    }else if(implementation === 'jwt'){
        for (let i = 0; i < repeatNumber; i++) {
            const token = jwt.sign(payload, secret, {algorithm: "HS256"});
            jwt.verify(token, secret);

        }
    }else{
        throw new Error('Invalid argument');
    }
}

measureMemUsage(implementation, repeatNumber, test);
//node --expose-gc .\benchmarks.js "jwt-native" 2
//node --expose-gc .\benchmarks.js "jwt" 2