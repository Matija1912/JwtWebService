//const jwt = require('../jwt-native-implementation/dist/index.js');
const jwt = require('jwt-native-implementation');


const payload = { userId: 123, username: "Klementina123" };
const secret = "your_secret_keyasdasdasdasd";

const token = jwt.sign(payload, secret, {algorithm: "HS256", notBefore: 2, audience:['www.something.eu', 'www.somethingelse.gov']});

setTimeout(() => {
    
    console.log(jwt.verify(token, secret, {audience: /^www\.somethingelse\.gov/i}));

}, 2000);