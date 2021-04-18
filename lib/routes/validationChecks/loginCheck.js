const { check } = require('express-validator')
const { INVALID_CREDENTIAL } = require('../../utilities/ResponseHelper/ResponseDescriptionKeyPair')

exports.loginFieldsCheck = [
    check('email', INVALID_CREDENTIAL).isEmail(),
    check('password', INVALID_CREDENTIAL).not().isEmpty()
]