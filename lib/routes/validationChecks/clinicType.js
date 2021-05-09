const { check, oneOf } = require('express-validator');

exports.createClinicTypeCheck = [
    check('clinicTypeName', "NO_CLINIC_TYPE_NAME").not().isEmpty(),
    check('clinicTypeDescription', "NO_CLINIC_TYPE_DESCRIPTION").not().isEmpty()
]

exports.clinicTypeByIdCheck = [
    oneOf([ 
        check('clinicTypeId', "NO_CLINIC_TYPE_ID").not().exists().bail(),
        check('clinicTypeId', "INVALID_CLINIC_TYPE_ID").isLength({ max: 24 })
    ])
]