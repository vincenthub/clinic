const UserInfoModel = require('./users/UserInfo')
const StaffInfoModel = require('./users/StaffInfo')
const AddressInfoModel = require('./users/AddressInfo');
const ClinicInfoModel = require('./clinics/ClinicInfo')
const ClinicTypeModel = require('./clinics/ClinicType')
const ClinicServiceModel = require('./clinics/ClinicService')
const ClinicScheduleModel = require('./clinics/ClinicSchedule')

module.exports = {
    UserInfoModel,
    StaffInfoModel,
    AddressInfoModel,
    ClinicInfoModel,
    ClinicTypeModel,
    ClinicServiceModel,
    ClinicScheduleModel
}