const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentSchema = new Schema({
    appointment_clinic_id: {
        type: Schema.Types.ObjectId,
        ref: "ClinicInfo"
    },
    appointment_user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    appointment_date: {
        type: Date,
        required: true
    },
    appointment_time: {
        type: Date,
        required: false
    },
    appointment_status: {
        type: String,
        required: true,
        default: "Pending"
    },
    appointment_create_by_user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    }
},  { timestamps : true });

module.exports = mongoose.model('Appointment', appointmentSchema);