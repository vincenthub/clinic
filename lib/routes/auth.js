const router = require('express').Router();

const { authenticationJWT } = require('./validationChecks/verifyToken')
const { register, login, updateUserStatus, sendSMSVerificationCode, verifySMSVerificationCode } =  require('../contollers/auth')
const { registerFieldsCheck } = require('./validationChecks/registerCheck')
const { loginFieldsCheck } = require('./validationChecks/loginCheck')
const { contactNumberCheck } = require('./validationChecks/contactNumberCheck')
const { createAdminCheck } = require('./validationChecks/createAdminCheck')
const { verificationCodeCheck } = require('./validationChecks/verificationCodeCheck')
const { createAdmin } = require('../contollers/admin')

////get controllers under controllers folder
router.post('/register', registerFieldsCheck, register);
router.post('/login', loginFieldsCheck, login);

//post controllers
router.post('/updateAppUserStatus', authenticationJWT, updateUserStatus);

router.post('/sendSMSVerificationCode', contactNumberCheck, sendSMSVerificationCode);
router.post('/verifySMSVerificationCode', [contactNumberCheck, verificationCodeCheck], verifySMSVerificationCode);
router.post('/createAdmin', createAdminCheck, createAdmin )

module.exports = router;
