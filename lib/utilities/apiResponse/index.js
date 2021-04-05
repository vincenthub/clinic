const { 
    BAD_REQUEST, 
    INTERNAL_SERVER_ERROR, 
    UNAUTHORIZE_ACCESS, 
    FORBIDDEN, 
    NOT_FOUND, 
    REQUEST_OK, 
    UNPROCESS_REQUEST
} = require("./httpResponseCodes");

const BadResponse = (res, errorObject) => {
    // Set status code
    return res.status(BAD_REQUEST).send({
            appMgmtResp: {
                responseHeader: {
                    txDateTime: new Date(),
                    respStatus: "ERROR"
                }
            },
            errorDetails : errorObject
        });
};

const NotFoundResponse = (res, errorObject) => {
    // Set status code
    return res.status(NOT_FOUND).send({
            appMgmtResp: {
                responseHeader: {
                    txDateTime: new Date(),
                    respStatus: "ERROR"
                }
            },
            errorDetails : errorObject
        });
};

const UnauthorizeResponse = (res, errorObject) => {
    // Set status code
    return res.status(UNAUTHORIZE_ACCESS).send({
            appMgmtResp: {
                responseHeader: {
                    txDateTime: new Date(),
                    respStatus: "ERROR"
                }
            },
            errorDetails : errorObject
        });
};

const UnprocessableResponse = (res, errorObject) => {
    // Set status code
    return res.status(UNPROCESS_REQUEST).send({
            appMgmtResp: {
                responseHeader: {
                    txDateTime: new Date(),
                    respStatus: "ERROR"
                }
            },
            errorDetails : errorObject
        });
};

const ForbiddenResponse = (res, errorObject) => {
    // Set status code
    return res.status(FORBIDDEN).send({
            appMgmtResp: {
                responseHeader: {
                    txDateTime: new Date(),
                    respStatus: "ERROR"
                }
            },
            errorDetails : errorObject
        });
};

const InternalServerErrorResponse = (res, errorObject) => {
    // Set status code
    return res.status(INTERNAL_SERVER_ERROR).send({
            appMgmtResp: {
                responseHeader: {
                    txDateTime: new Date(),
                    respStatus: "ERROR"
                }
            },
            errorDetails : errorObject
    });
};

const OkResponse =  (res, responseObject) => {
    // Set status code
    return res.status(REQUEST_OK).send({
        appMgmtResp: {
            responseHeader: {
                txDateTime: new Date(),
                respStatus: "OK"
            }
        },
        responseBody : responseObject
    });
};

module.exports = {
    BadResponse,
    NotFoundResponse,
    ForbiddenResponse,
    UnauthorizeResponse,
    UnprocessableResponse,
    InternalServerErrorResponse,
    OkResponse
}