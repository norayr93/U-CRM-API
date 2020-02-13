const logger = require('../config/logger');

const modifyMessage = (message = '', label = '') => `[${label}] - ${message}`;

const init = app => {
    app.use((req, res, next) => {
        const start = +new Date();

        req.logger = {
            debug: (message, label) => logger.debug(modifyMessage(message, label), {url: req.originalUrl}),
            info: (message, label) => logger.info(modifyMessage(message, label), {url: req.originalUrl}),
            warn: (message, label) => logger.warn(modifyMessage(message, label), {url: req.originalUrl}),
            error: (message, label) => logger.error(modifyMessage(message, label), {url: req.originalUrl}),
        };

        res.on('finish', () => {
            const timeMs = +new Date() - start;
            req.logger.info(
                `${req.method} ${req.originalUrl} ${res.statusCode} ${res.statusMessage} ${timeMs} ms`,
                'request',
            );
        });
        next();
    });
};

module.exports = init;
