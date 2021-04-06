const { response } = require("express");
const momentTimezone = require("moment-timezone");
const { 
    REQUEST_OK
} = require("./httpResponseCodes");
const { UNKNOWN_ERROR } = require("./responseCodes");

const ErrorResponse = (res, apiFunction, errorHttpCode, errorObject) => {
   
    if (typeof errorObject !== 'object') {
        UNKNOWN_ERROR['errorDescription'] = errorObject;
        errorObject = UNKNOWN_ERROR; 
    }

    const item = {}
    item[apiFunction] = { 
        responseHeader: {
            txDateTime: momentTimezone().tz(process.env.TIMEZONE),
            respStatus: "ERROR"
        }, 
        errorDetails: errorObject  
    }
    // Set status code
    return res.status(errorHttpCode).send(item);
}

const OkResponse = (res, apiFunction, responseObject) => {
    const item = {}
    item[apiFunction] = {
        responseHeader: {
            txDateTime: momentTimezone().tz(process.env.TIMEZONE),
            respStatus: "SUCCESS"
        },
        responseBody : responseObject,
        errorDetails: {}
    }
    // Set status code
    return res.status(REQUEST_OK).send(item);
};

module.exports = {
    ErrorResponse,
    OkResponse
}