const { check } = require('express-validator');
const { INVALID_EMAIL_ADDRESS, REQUIRED_FIRSTNAME, REQUIRED_LASTNAME, REQUIRED_MOBILENUMBER } = require('../../utilities/ResponseHelper/ResponseDescriptionKeyPair');

exports.createStaffCheck = [

    check('email', INVALID_EMAIL_ADDRESS.isEmail(),
    check('firstName', REQUIRED_FIRSTNAME).not().isEmpty(),
    check('lastName', REQUIRED_LASTNAME).not().isEmpty(),
    check('mobileNumber', REQUIRED_MOBILENUMBER).not().isEmpty(),
    check('mobileNumber', INVALID_CONTACTNUMBER ).matches(/^639[0-9]{9}$/)
    
]
