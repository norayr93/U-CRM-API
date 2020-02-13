const config = require('config');
const createError = require('http-errors');
const express = require('express');
const morgan = require('morgan');
const winston = require('winston');

const loggerMiddleware = require('../middlewares/logger');
const httpResponse     = require('../middlewares/http-response');
const httpRequest      = require('../middlewares/http-request');
const route            = require('../middlewares/route');
const error            = require('../middlewares/error');

const {morgan_format} = config.get('logger');

const app = express();

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

loggerMiddleware(app);

httpRequest(app);

httpResponse(app);

route(app);

// error(app);

app.use(express.urlencoded());

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    winston.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);

    res.status(err.status || 500);
});

module.exports = app;