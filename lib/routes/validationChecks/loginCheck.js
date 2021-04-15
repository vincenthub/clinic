const { check } = require('express-validator')

exports.loginFieldsCheck = [
    check('email', "Please enter a valid email address").isEmail(),
    check('password', "Please enter your password").not().isEmpty()
]