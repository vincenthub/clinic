const { check } = require('express-validator');

exports.createAdminCheck = [
    check('email', "NO_VALID_EMAIL").isEmail(),
    check('firstName', "NO_FIRST_NAME").not().isEmpty(),
    check('lastName', "NO_LAST_NAME").not().isEmpty(),
]
