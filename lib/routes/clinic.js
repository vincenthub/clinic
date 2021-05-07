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

//get controllers under controllers folder
router.get('/', authenticationJWT, clinicInfo);
router.post('/', authenticationJWT, registerClinic);

//clinic type
router.post('/clinicType',createClinicTypeCheck, authenticationJWT, createClinicType)
router.get('/clinicType', clinicTypeByIdCheck, authenticationJWT, systemClinicTypes)

module.exports = router;