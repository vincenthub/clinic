const { check } = require('express-validator');

exports.registerClinicCheck = [
    check('clinicName', 'INVALID_CLINIC_NAME').isLength({ min: 1, max: 255 }),
    check('shortDescription', 'INVALID_SHORT_DESCRIPTION').isLength( { min: 1, max: 100}),
    check('staffId', 'STAFF_NOT_FOUND').not().isEmpty().bail().isLength({ min: 24, max: 24 }),
    check('clinicTypeId', 'CLINIC_TYPE_NOT_FOUND').not().isEmpty().bail().isLength({ min: 24, max: 24 }),
];
