const { check } = require('express-validator');

exports.verificationCodeCheck = [
    check('verificationCode', "NO_VALID_CODE").matches(/^[0-9]{6}$/)
]
