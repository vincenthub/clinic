const momentTimezone = require("moment-timezone");

const ErrorResponse = ( endpointKey, errorDetail ) => {

    if ( !(errorDetail.errorDescription instanceof Array)) {
        errorDetail.errorDescription = !(errorDetail.errorDescription instanceof Object)? [{ message: errorDetail.errorDescription }] : [ errorDetail.errorDescription ];
    }

    const matchValidator = errorDetail.errorDescription[0];
    if ( Object.keys(matchValidator).length === 4 &&
        matchValidator.value !== undefined &&
        matchValidator.msg !== undefined &&
        matchValidator.param !== undefined &&
        matchValidator.location !== undefined) {
        errorDetail.errorType = 'ValidationError'
    }


    const responseItem = {}
    responseItem[endpointKey] = {
        responseHeader: {
            txDateTime: momentTimezone().tz(process.env.TIMEZONE),
            respStatus: "ERROR"
        },
        responseBody: {},
        errorDetail:  errorDetail
    }
    return responseItem;
}

const SuccessResponse = ( endpointKey, responseBody = {} ) => {
    const responseItem = {}
    responseItem[endpointKey] = {
        responseHeader: {
            txDateTime: momentTimezone().tz(process.env.TIMEZONE),
            respStatus: "SUCCESS"
        },
        responseBody,
        errorDetail: []
    }
    return responseItem;
}

module.exports = { SuccessResponse, ErrorResponse }
