const {
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    BAD_REQUEST,
    UNAUTHORIZED,
} = require('http-status-codes');
const _ = require('lodash');
const createError = require('http-errors');

const handleError = err => {
    return _.cond([
        [
            () => err['array'] instanceof Function,
            data => {
                const validationError = _.head(data.array());

                const badRequestError = new BadRequestError('Validation Error');

                badRequestError.message = validationError.msg;
                badRequestError.parameter = validationError.param;
                badRequestError.value = validationError.value;
                badRequestError.location = validationError.location;
                badRequestError.isOperational = true;

                return badRequestError;
            },
        ],
        [
            () => err.response,
            (res) => {
                const {data} = res;
                if (Array.isArray(_.head(data))) {
                    return _.cond([
                        [data => data.statusCode === UNAUTHORIZED, _.constant(new UnauthorizedRequestError(data.message, true))],
                        [data => data.statusCode === BAD_REQUEST, _.constant(new BadRequestError(data.message, true))],
                        [_.stubTrue, _.constant(new InternalServerError('Unknown', true))],
                    ])(_.head(data));
                }
            },
        ],
        [
            () => err.status,
            () => {
                return _.cond([
                    [() => err.status === UNAUTHORIZED, _.constant(new UnauthorizedRequestError(err.message, true))],
                    [() => err.status === BAD_REQUEST, _.constant(new BadRequestError(err.message, true))],
                    [() => err.status === NOT_FOUND, _.constant(new NotFoundError(err.message, true))],
                    [_.stubTrue, _.constant(new InternalServerError('Unknown', true))],
                ]);
            },
        ],
        [_.stubTrue, _.constant(createError(err.status))],
    ])(err);
};

class GenericError extends Error {
    constructor(message, status, isOperational) {
        super(message);
        this.status = status;
        this.message = message;
        this.isOperational = isOperational;
        this.name = _.get(this, ['constructor', 'name']);
    }
}

class UnauthorizedRequestError extends GenericError {
    constructor(message = 'Unauthorized Request Error', isOperational) {
        super(message, UNAUTHORIZED, isOperational);
    }
}

class BadRequestError extends GenericError {
    constructor(message = 'Bad Request Error', isOperational) {
        super(message, BAD_REQUEST, isOperational);
    }
}

class InternalServerError extends GenericError {
    constructor(message = 'Internal Server Error') {
        super(message, INTERNAL_SERVER_ERROR);
    }
}

class NotFoundError extends GenericError {
    constructor(message = 'Not Found') {
        super(message, NOT_FOUND);
    }
}

module.exports = {
    handleError,
    BadRequestError,
    InternalServerError,
    NotFoundError,
};

// process.on('unhandledRejection', reason => {
//     throw reason;
// });

// process.on('uncaughtException', (error) => {
//     debugger;
//     const errorObject = handleError(error);
//     if (errorObject.isOperational && !errorObject.isOperational(error)) process.exit(1);
// });
