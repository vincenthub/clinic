const { check } = require('express-validator')
const { 
    REQUIRED_FIRSTNAME, 
    REQUIRED_LASTNAME,
    INVALID_EMAIL_ADDRESS, 
    INVALID_PASSWORD, 
    REQUIRED_MOBILENUMBER 
} = require('../../utilities/ResponseHelper/ResponseDescriptionKeyPair')

exports.registerFieldsCheck = [
    check('firstName', REQUIRED_FIRSTNAME).not().isEmpty(),
    check('lastName', REQUIRED_LASTNAME).not().isEmpty(),
    check('mobileNumber', REQUIRED_MOBILENUMBER).not().isEmpty(),
    check('email', INVALID_EMAIL_ADDRESS).isEmail(),
    check('password', INVALID_PASSWORD).isLength({ min: 8})
]

