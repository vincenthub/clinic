const router = require('express').Router();
const { registerClinic } =  require('../contollers/clinic')
const { addressFieldsCheck } = require('../routes/validationChecks/commonFieldsCheck')
const { authenticationJWT } = require('./validationChecks/verifyToken')
const { registerClinicCheck } = require('../routes/validationChecks/registerClinicCheck')

router.post('/registerClinic', authenticationJWT, registerClinicCheck, addressFieldsCheck,  registerClinic)

module.exports = router;
