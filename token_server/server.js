const config = require('./config');
const express = require('express');
const jwt = require('jwt-native-implementation');
const app = express();

const api = require('./app/routes/api');

const apiRouter = api(express);

app.use('/api', apiRouter);

app.listen( config.port, () => {
    console.log(`Server running on:  http://localhost:${config.port}`);
} )


// const payload = { userId: 123, username: "Klementina123" };
// const secret = "your_secret_keyasdasdasdasd";

// const token = jwt.sign(payload, secret, {algorithm: "HS256", notBefore: 2, audience:['www.something.eu', 'www.somethingelse.gov']});

// setTimeout(() => {
    
//     console.log(jwt.verify(token, secret, {audience: /^www\.somethingelse\.gov/i}));

// }, 3000);
