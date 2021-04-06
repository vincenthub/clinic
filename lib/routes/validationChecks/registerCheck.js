const { check } = require('express-validator')

exports.registerFieldsCheck = [
    check('firstName', "First name is required").not().isEmpty(),
    check('lastName', "First name is required").not().isEmpty(),
    // check('mobileNumber', "First name is required").not().isEmpty(),
    // check('permissionLevel', "Select what type of account you want.").not().isEmpty(),
    check('email', "Please input a valid email address").isEmail(),
    check('password', "Please enter at least 8 characters or more").isLength({ min: 8})
]

