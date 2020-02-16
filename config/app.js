const config = require('config');
const createError = require('http-errors');
const passport = require('passport');
const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const morgan = require('morgan');
const winston = require('winston');

require('./database');
require('../services/passport')(passport);

const loggerMiddleware = require('../middlewares/logger');
const httpResponse     = require('../middlewares/http-response');
const httpRequest      = require('../middlewares/http-request');
const route            = require('../middlewares/route');
const error            = require('../middlewares/error');
const swagger          = require('../middlewares/swagger');
const auth             = require('../middlewares/auth');

const {morgan_format} = config.get('logger');
const {cookieKey} = config.get('session');

const app = express();

app.use(cors());

app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [cookieKey],
  }),
);

app.use(
  morgan(morgan_format, {
    skip: (req, res) => res.statusCode < 400,
    stream: process.stderr,
  }),
);

app.use(
  morgan(morgan_format, {
    skip: (req, res) => res.statusCode >= 400,
    stream: process.stdout,
  }),
);

swagger(app);

loggerMiddleware(app);

httpRequest(app);

httpResponse(app);

route(app);

error(app);

auth(app);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    res.status(err.status || 500).send({status: err.status});
});

module.exports = app;