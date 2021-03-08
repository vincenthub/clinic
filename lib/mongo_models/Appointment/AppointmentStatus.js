const mongoose = require('mongoose');
const { Schema } = mongoose;

const appointmentStatus = new Schema({

    appointment_status_name: {
        type: String,
        required: true
    },
    appointment_status_description: {
        type: String,
        required: true
    },
    appointment_status_create_by_user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    appointment_status_create_status: {
        type: Schema.Types.ObjectId,
        ref: "RecordStatus"
    }

},  { timestamps : true });

module.exports = mongoose.model('ClinicSchedule', clinicScheduleSchema);

// APPT_STATUS_QUEUED (user just made an appt, not yet accepted by clinic yet),
// APPT_STATUS_SCHEDULED (clinic confirmed the schedule of the user’s appointment),
// APPT_STATUS_PRESENT (user attended the appointment)
// APPT_STATUS_CANCELED (user/clinic canceled)
// APPT_STATUS_MISSED (user missed the appointment)