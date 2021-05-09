const router = require('express').Router();
const {
    registerClinic,
    clinicInfo,
    createClinicType,
    systemClinicTypes,
    clinicTypeById
} =  require('../contollers/clinic')
const {
    authenticationJWT,
    createClinicTypeCheck,
    clinicTypeByIdCheck
} = require('./validationChecks')

router.post('/registerClinic', authenticationJWT, registerClinicCheck, addressFieldsCheck,  registerClinic)

//clinic type
router.post('/clinicType',createClinicTypeCheck, authenticationJWT, createClinicType)
router.get('/clinicType', clinicTypeByIdCheck, authenticationJWT, systemClinicTypes)

module.exports = router;
