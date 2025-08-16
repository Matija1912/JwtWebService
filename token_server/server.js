const config = require('./config');
const express = require('express');
const jwt = require('jwt-native-implementation');
const app = express();
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const argon2 = require('argon2');
const cors = require('cors');


const pool = mysql.createPool(config.pool);

const api = require('./app/routes/api/api');
const auth = require('./app/routes/auth/auth');
const sessionRestore = require('./app/routes/auth/sessionRestore');

const apiRouter = api(express, pool);
const authRouter = auth(express, pool, argon2, jwt, config.secret);
const sessionRestoreRouter = sessionRestore(express, pool, jwt, config.secret);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(morgan('dev'));

app.use(cors({
  origin: 'http://localhost:4200',   // Angular dev server
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/api', apiRouter);
app.use('/auth', authRouter);
app.use('/sessionRestore', sessionRestoreRouter);

app.listen( config.port, () => {
    console.log(`Server running on:  http://localhost:${config.port}`);
} )


// const payload = { userId: 123, username: "Klementina123" };
// const secret = "your_secret_keyasdasdasdasd";

// const token = jwt.sign(payload, secret, {algorithm: "HS256", notBefore: 2, audience:['www.something.eu', 'www.somethingelse.gov']});

// setTimeout(() => {
    
//     console.log(jwt.verify(token, secret, {audience: /^www\.somethingelse\.gov/i}));

// }, 3000);
