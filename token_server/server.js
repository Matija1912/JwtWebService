const config = require('./config');
const express = require('express');
const jwt = require('jwt-native-implementation');
const app = express();
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const argon2 = require('argon2');
const cors = require('cors');
const middleware = require('./app/routes/middleware');
const userApiMiddleware = require('./app/routes/userApiMiddleware');
const {randomBytes} = require('crypto');

const pool = new Pool(config.pool);

const auth = require('./app/routes/auth/auth');
const sessionRestore = require('./app/routes/auth/sessionRestore');
const projectsApi = require('./app/routes/api/projectsApi');
const userAuthApi = require('./app/routes/api/userAuthApi');

const authRouter = auth(express, pool, argon2, jwt, config.secret);
const sessionRestoreRouter = sessionRestore(express, jwt, config.secret, middleware);
const projectsApiRouter = projectsApi(express, pool, jwt, config.secret, middleware, randomBytes, config.backendUrl, argon2);
const userAuthApiRouter =  userAuthApi(express, pool, jwt, config.secret, userApiMiddleware, argon2);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(morgan('dev'));

app.use(cors({
  origin: 'http://localhost:4200',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  
}));


app.use('/auth', authRouter);
app.use('/sessionRestore', sessionRestoreRouter);
app.use('/projects', projectsApiRouter);
//public api
app.use('/api', userAuthApiRouter);

app.listen( config.port, config.host, () => {
    console.log(`Server running on: http://localhost:${config.port}`);
} )
//9962984cf6847f4271582f9d97261e91439778573c7436e7438f3e06865dac8c2a2d61eaa00f16cf0fac44e220ce76c402b763addc74c080e47f091167b6eacc