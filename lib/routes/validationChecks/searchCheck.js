const { check } = require('express-validator')

exports.checking = [
    check('email', "Please input a valid email address").isEmail()
]





