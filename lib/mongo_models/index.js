const UserInfoModel = require('./users/UserInfo')
const StaffInfoModel = require('./users/StaffInfo')
const AddressInfoModel = require('./users/AddressInfo');
const ClinicTypeModel = require('./clinics/ClinicType')
const ClinicInfoModel = require('./clinics/ClinicInfo')
const ClinicServiceModel = require('./clinics/ClinicService')
const ClinicScheduleModel = require('./clinics/ClinicSchedule')

module.exports = {
    UserInfoModel,
    StaffInfoModel,
    AddressInfoModel,
    ClinicTypeModel,
    ClinicInfoModel,
    ClinicServiceModel,
    ClinicScheduleModel
}