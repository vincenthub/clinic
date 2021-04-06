const { check } = require('express-validator');

exports.contactNumberCheck = [
    // should start with 639 plus 10 digit
    check('contactNumber', "NO_VALID_CONTACT_NUMBER").matches(/^639[0-9]{9}$/)
]
