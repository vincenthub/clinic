const { BAD_REQUEST, FORBIDDEN, INTERNAL_SERVER_ERROR, NOT_FOUND, REQUEST_OK, UNAUTHORIZED_ACCESS, UNPROCESSED_REQUEST } = require('./HttpResponseCodes');

class ErrorDetail extends Error {

    constructor( {errorCode, errorDescription, statusCode = 500, errorType='DefaultError'} ) {
        super(errorDescription);
        this.errorCode = errorCode
        this.errorType = errorType
        this.statusCode = statusCode
        this.errorDescription = errorDescription
        Error.captureStackTrace(this, ErrorDetail)
    }

}

class HttpError extends ErrorDetail {

    constructor( errorCode, errorDescription, statusCode, errorType ) {
        super({ errorCode, errorDescription, statusCode, errorType });
    }

}
class HttpBadRequest extends ErrorDetail {

    constructor(errorCode, errorDescription) {
        super({errorCode, errorDescription, statusCode: BAD_REQUEST, errorType: 'HttpBadRequest'});

    }

}

class HttpNotFound extends ErrorDetail {

    constructor(errorCode, errorDescription) {
        super({errorCode, errorDescription, statusCode: NOT_FOUND, errorType: 'HttpNotFound'});

    }

}

class HttpInternalServerError extends ErrorDetail {

    constructor(errorCode, errorDescription) {
        super({errorCode, errorDescription, statusCode: INTERNAL_SERVER_ERROR, errorType: 'HttpInternalServerError'});

    }

}

class HttpUnauthorizedAccess extends ErrorDetail {

    constructor(errorCode, errorDescription) {
        super({errorCode, errorDescription, statusCode: UNAUTHORIZED_ACCESS, errorType: 'HttpUnauthorizedAccess'});

    }

}

class HttpForbidden extends ErrorDetail {

    constructor(errorCode, errorDescription) {
        super({errorCode, errorDescription, statusCode: FORBIDDEN, errorType: 'HttpForbidden'});

    }

}

class HttpUnprocessedRequest extends ErrorDetail {

    constructor(errorCode, errorDescription) {
        super({errorCode, errorDescription, statusCode: UNPROCESSED_REQUEST, errorType: 'HttpUnprocessedRequest'});

    }

}

module.exports = { HttpError, HttpBadRequest, HttpNotFound, HttpInternalServerError, HttpUnauthorizedAccess, HttpForbidden, HttpUnprocessedRequest }
