const mongoose = require('mongoose');
const { Schema } = mongoose;

const { APPOINTMENT_STATUS, RECORD_STATUS } = require('../../utilities/config')

const appointmentInfoSchema = new Schema({
    appointment_info_clinic_id: {
        type: Schema.Types.ObjectId,
        ref: "ClinicInfo"
    },
    appointment_info_user_id: {
        type: Schema.Types.ObjectId,
        ref: "UserInfo"
    },
    appointment_info_date: {
        type: Date,
        required: true
    },
    appointment_info_time: {
        type: Date,
        required: false
    },
    appointment_info_service_id: {
        type: Schema.Types.ObjectId,
        ref: "ClinicService",
        required: true
    },
    appointment_info_status: {
        type: String,
        required: true,
        default: APPOINTMENT_STATUS.QUEUED
    },
    appointment_info_create_by_user_id: {
        type: Schema.Types.ObjectId,
        ref: "UserInfo"
    },
    appointment_info_create_status: {
        type: Number,
        required: false,
        default: RECORD_STATUS.ACTIVE
    }
},  { timestamps : true });

module.exports = mongoose.model('AppointmentInfo', appointmentInfoSchema);