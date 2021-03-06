const router = require('express').Router();
const { registerClinic, clinicInfo } =  require('../contollers/clinic')
const { authenticationJWT } = require('./validationChecks/verifyToken')

//get controllers under controllers folder
router.get('/', authenticationJWT, clinicInfo);
router.post('/', authenticationJWT, registerClinic);

module.exports = router;