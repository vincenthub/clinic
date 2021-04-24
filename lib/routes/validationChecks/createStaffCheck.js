const { check } = require('express-validator');
const { 
    INVALID_EMAIL_ADDRESS, 
    REQUIRED_FIRSTNAME, 
    REQUIRED_LASTNAME, 
    INVALID_CONTACT_NUMBER 
} = require('../../utilities/ResponseHelper/ResponseDescriptionKeyPair');

exports.createStaffCheck = [

    check('email', INVALID_EMAIL_ADDRESS).isEmail(),
    check('firstName',REQUIRED_FIRSTNAME).not().isEmpty(),
    check('lastName', REQUIRED_LASTNAME).not().isEmpty(),
    check('mobileNumber', INVALID_CONTACT_NUMBER ).matches(/^639[0-9]{9}$/)
    
]
