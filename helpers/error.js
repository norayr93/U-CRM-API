const {
    INTERNAL_SERVER_ERROR,
    NOT_FOUND,
    BAD_REQUEST,
    UNAUTHORIZED,
} = require('http-status-codes');

const handleError = err => {
    return R.cond([
        [
            R.compose(R.is(Function), R.prop('array')),
            data => {
                const validationError = R.pipe(
                    R.head,
                    R.when(
                        R.compose(R.is(Array), R.prop('nestedErrors')),
                        R.compose(R.head, R.prop('nestedErrors')),
                    ),
                )(data.array());

                const badRequestError = new BadRequestError('Validation Error');

                badRequestError.message = validationError.msg;
                badRequestError.parameter = validationError.param;
                badRequestError.value = validationError.value;
                badRequestError.location = validationError.location;

                return badRequestError;
            },
        ],
        [
            R.has('response'),
            R.pipe(
                R.path(['response', 'data']),
                R.when(Array.isArray, R.head),
                R.cond([
                    [R.compose(R.equals(UNAUTHORIZED), R.prop('statusCode')), errData => {
                        const unauthorizedRequestError = new UnauthorizedRequestError(
                            R.reduce(R.concat, '', [
                                R.toString(errData.statusCode),
                                ' ',
                                R.propOr('', 'message', errData),
                            ]),
                        );
                        unauthorizedRequestError.location = 'auth0';

                        return unauthorizedRequestError;
                    }],
                    [R.compose(R.has('fbtrace_id'), R.prop('error')), errData => {
                        const badRequestError = new BadRequestError(
                            R.reduce(R.concat, '', [
                                'Type: ',
                                R.path(['error', 'type'], errData),
                                '. Code/Subcode: ',
                                [
                                    R.path(['error', 'code'], errData),
                                    R.pathOr('0', ['error', 'error_subcode'], errData),
                                ].join('/'),
                                '. Message: ',
                                R.path(['error', 'message'], errData),
                                '.',
                            ]),
                        );
                        badRequestError.location = 'facebook';
                        badRequestError.value = R.path(['error', 'error_data', 0], errData);

                        return badRequestError;
                    }],
                    [R.has('error_description'), errData => {
                        const badRequestError = new BadRequestError(
                            R.reduce(R.concat, '', [
                                'Type: ',
                                errData.error,
                                '. Message: ',
                                errData.error_description,
                                '.',
                            ]),
                        );
                        badRequestError.location = 'salesforce';

                        return badRequestError;
                    }],
                    [R.has('errorCode'), errData => {
                        const badRequestError = new BadRequestError(
                            R.reduce(R.concat, '', [
                                'Type: ',
                                errData.errorCode,
                                '. Message: ',
                                errData.message,
                                '.',
                            ]),
                        );
                        badRequestError.location = errData.errorCode;

                        return badRequestError;
                    }],
                    [R.T, () => {
                        const internalServerError = new InternalServerError('Unknown service');
                        internalServerError.location = 'unknown';

                        return internalServerError;
                    }],
                ]),
            ),
        ],
        [
            R.T,
            R.identity,
        ],
    ])(err);
};

class GenericError extends Error {
    constructor(message, status) {
        super(message);

        this.name = R.path(['constructor', 'name'], this);
        this.status = status;
    }
}

class UnauthorizedRequestError extends GenericError {
    constructor(message = 'Unauthorized Request Error') {
        super(message, UNAUTHORIZED);
    }
}

class BadRequestError extends GenericError {
    constructor(message = 'Bad Request Error') {
        super(message, BAD_REQUEST);
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
