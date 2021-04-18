const { check } = require('express-validator')
const { INVALID_EMAIL_ADDRESS } = require('../../utilities/ResponseHelper/ResponseDescriptionKeyPair');
exports.checking = [
    check('email', INVALID_EMAIL_ADDRESS ).isEmail()
]





