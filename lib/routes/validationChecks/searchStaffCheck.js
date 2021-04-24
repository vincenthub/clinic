const { check } = require('express-validator');

exports.searchStaffChecks = [
    check('searchBody').notEmpty(),
    check('searchBody').isLength({ min: 3 })
]
