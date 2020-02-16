const config = require('config');
const {get} = require('lodash');
const statusCodes = require('http-status-codes');

const {handleError} = require('../helpers/error');

const env = config.util.getEnv('NODE_ENV');

const init = app => {
    app.use((err, req, res, next) => {
        if (res.headersSent) return next(err);

        // const internalServerError = statusCodes.INTERNAL_SERVER_ERROR;
        const handledError = handleError(err);

        // handledError.status = R.ifElse(
        //     R.hasIn('status'),
        //     R.prop('status'),
        //     R.always(internalServerError),
        // )(handledError);

        const errorStatus = handledError.status;
        const errorMessage = get(handledError, 'message', '');

        req.logger.error(handledError, 'app');

        const stack = env === 'development' ? handledError.stack : {};

        return res.status(errorStatus).json({
            error: {
                name: handledError.name,
                status: errorStatus,
                message: errorMessage,
                parameter: get(handledError, 'parameter', ''),
                value: get(handledError, 'value', ''),
                location: get(handledError, 'location', ''),
                stack,
            },
        });
    });
};

module.exports = init;
