const config = require('./config');
const express = require('express');
const jwt = require('jwt-native-implementation');
const app = express();
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const argon2 = require('argon2');
const cors = require('cors');
const middleware = require('./app/routes/middleware')
const {randomBytes} = require('crypto');

const pool = new Pool(config.pool);

const auth = require('./app/routes/auth/auth');
const sessionRestore = require('./app/routes/auth/sessionRestore');
const projectsApi = require('./app/routes/api/projectsApi');

const authRouter = auth(express, pool, argon2, jwt, config.secret);
const sessionRestoreRouter = sessionRestore(express, jwt, config.secret, middleware);
const projectsApiRouter = projectsApi(express, pool, jwt, config.secret, middleware, randomBytes);

// const s256 = jwt.crypto.createSha256();
// console.log(s256.update('data').digest('hex'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(morgan('dev'));

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use('/auth', authRouter);
app.use('/sessionRestore', sessionRestoreRouter);
app.use('/projects', projectsApiRouter);

app.listen( config.port, () => {
    console.log(`Server running on:  http://localhost:${config.port}`);
} )