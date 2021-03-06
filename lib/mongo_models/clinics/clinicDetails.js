const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const clinicDetailsSchema = new Schema({
    appUserID: {
        type: Schema.Types.ObjectId, 
        ref: 'AppUsers',
        required: true
    },
    cClinicTypeId: {
        type: Schema.Types.ObjectId, 
        ref: 'ClinicType',
        required: true
    },
    cServiceIds: {
        type: [{
            type: Schema.Types.ObjectId, 
            ref: 'ClinicService',
        }],
        required: true,
        min: 1
    },
    cDoctorId: {
        type: Schema.Types.ObjectId, 
        ref: 'DoctorDetails',
        required: true
    },
    cAddressId: {
        type: Schema.Types.ObjectId, 
        ref: 'AddressDetails',
        required: true
    },
    cScheduleIds: {
        type: [{
            type: Schema.Types.ObjectId, 
            ref: 'ClinicSchedule',
        }],
        required: true,
        min: 1
    },
    cName: {
        type: String,
        required: true
    },
    cAbout: {
        type: String,
        required: true
    },
    cMobile: {
        type: String,
        required: true
    },
    cTelephone: {
        type: String
    }
},{ timestamps: true });

//note: modelname is saved to mongodb atlas
module.exports = mongoose.model('ClinicDetails', clinicDetailsSchema) //params: modelname, schema
