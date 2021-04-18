const { check } = require('express-validator');
const { NO_VALID_CODE } = require('../../utilities/ResponseHelper/ResponseDescriptionKeyPair');

exports.verificationCodeCheck = [
    check('verificationCode', NO_VALID_CODE ).matches(/^[0-9]{6}$/)
]
