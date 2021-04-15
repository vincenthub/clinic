const { check } = require('express-validator');

exports.createStaffCheck = [

    check('email', "Please input a valid email address").isEmail(),
    check('firstName', "First name is required").not().isEmpty(),
    check('lastName', "First name is required").not().isEmpty(),
    // check('mobileNumber', "First name is required").not().isEmpty(),
    
]
