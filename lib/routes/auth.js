const router = require('express').Router();

const { authenticationJWT } = require('./validationChecks/verifyToken')
const { register, login, updateUserStatus } =  require('../contollers/auth')
const { registerFieldsCheck } = require('./validationChecks/registerCheck')
const { loginFieldsCheck } = require('./validationChecks/loginCheck')

////get controllers under controllers folder
router.post('/register', registerFieldsCheck, register);
router.post('/login', loginFieldsCheck, login);

//post controllers
router.post('/updateAppUserStatus', authenticationJWT, updateUserStatus);


module.exports = router;