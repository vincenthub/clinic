const router = require('express').Router();

const { authenticationJWT } = require('./validationChecks/verifyToken')
const { register, login, updateUserStatus, sendSMSVerificationCode } =  require('../contollers/auth')
const { registerFieldsCheck, loginFieldsCheck } = require('./validationChecks/registerCheck')
const { contactNumberCheck } = require('./validationChecks/contactNumberCheck')

////get controllers under controllers folder
router.post('/register', registerFieldsCheck, register);
router.post('/login', loginFieldsCheck, login);

//post controllers
router.post('/updateAppUserStatus', authenticationJWT, updateUserStatus);

router.post('/sendSMSVerificationCode', contactNumberCheck, sendSMSVerificationCode);

module.exports = router;
