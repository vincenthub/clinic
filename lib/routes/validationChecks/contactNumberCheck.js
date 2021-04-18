const { check } = require('express-validator');
const { INVALID_CONTACTNUMBER } = require('../../utilities/ResponseHelper/ResponseDescriptionKeyPair');

exports.contactNumberCheck = [
    // should start with 639 plus 10 digit
    check('contactNumber', INVALID_CONTACTNUMBER ).matches(/^639[0-9]{9}$/)
]
