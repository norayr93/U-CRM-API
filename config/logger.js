const appRoot = require('app-root-path');
const {createLogger, format, transports} = require('winston');
const config = require('config');

const {log_level} = config.get('logger');

const developmentOptions = {
    level: 'info',
    filename: `${appRoot}/logs/app.log`,
    handleExceptions: true,
    json: true,
    maxsize: 5242880,
    maxFiles: 5,
    colorize: false,
};

const formatParams = info => {
    const {
        timestamp, level, message, ...args
    } = info;

    const ts = timestamp.slice(0, 19).replace('T', ' ');
    return `${ts} [${level}]: ${message} ${Object.keys(args).length ? JSON.stringify(args, null, 2) : ''}`;
};

const developmentFormat = format.combine(
    format.colorize(),
    format.timestamp(),
    format.align(),
    format.printf(formatParams),
);

const productionFormat = format.combine(
    format.timestamp(),
    format.align(),
    format.printf(formatParams),
);

let logger;

if (process.env.NODE_ENV !== 'production') {
    logger = createLogger({
        level: log_level,
        exitOnError: true,
        format: developmentFormat,
        transports: [
            new transports.Console(),
            new transports.File(developmentOptions),
        ],
    });

} else {
    logger = createLogger({
        level: log_level,
        format: productionFormat,
        transports: [
            new transports.File({filename: 'error.log', level: 'error'}),
            new transports.File({filename: 'combined.log'}),
        ],
    });
}

module.exports = logger;