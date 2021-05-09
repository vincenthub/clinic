const {
    createClinicTypeCheck,
    clinicTypeByIdCheck
} = require('./clinicType')
const { loginFieldsCheck } = require('./loginCheck')
const { contactNumberCheck } = require('./contactNumberCheck')
const { createAdminCheck } = require('./createAdminCheck')
const { createStaffCheck } = require('./createStaffCheck')
const { registerFieldsCheck } = require('./registerCheck')
const { searchStaffChecks } = require('./searchStaffCheck')
const { checking } = require('./searchCheck')
const { verificationCodeCheck } = require('./verificationCodeCheck')
const { authenticationJWT } = require('./verifyToken')
const { registerClinicCheck } = require('./registerClinicCheck')
const { commonFieldsCheck } = require('./commonFieldsCheck')

module.exports = {
    createAdminCheck,
    createClinicTypeCheck,
    loginFieldsCheck,
    contactNumberCheck,
    createStaffCheck,
    registerFieldsCheck,
    searchStaffChecks,
    checking,
    verificationCodeCheck,
    clinicTypeByIdCheck,
    authenticationJWT,
    commonFieldsCheck,
    registerClinicCheck,
}
