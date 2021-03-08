const mongoose = require('mongoose');
const { Schema } = mongoose;

const clinicScheduleSchema = new Schema({

    clinic_schedule_clinic_id: {
        type: Schema.Types.ObjectId,
        ref: "Clinic"
    },
    clinic_schedule_name: {
        type: String,
        required: true
    },
    clinic_schedule_description: {
        type: String,
        required: false
    },
    clinic_schedule_date: {
        type: Date, // YYYY-DD-MM
        required: true
    },
    clinic_schedule_repeat: {
        type: Schema.Types.ObjectId,
        ref: "ClinicScheduleRepeat"
    },
    clinic_schedule_repeat_end_date: {
        type: Date,
        required: true
    },
    clinic_schedule_start_time: {
        type: Date, // HH:MM
        required: true
    },
    clinic_schedule_end_time: {
        type: Date, // HH:MM
        required: true
    },
    clinic_schedule_max_slots: {
        type: Number,
        min: 0,
        max: 500
    },
    clinic_schedule_time_offset: {
        type: String,
        required: false,
        default: "+0800",
        min: 5,
        max: 5
    },
    clinic_schedule_status: {
        type: Schema.Types.ObjectId,
        ref: "ClinicScheduleStatus"
    },
    clinic_schedule_published: {
        type: Boolean,
        required: true,
        default: false
    },
    clinic_schedule_create_by_user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    // active, deleted
    clinic_schedule_create_status: {
        type: Schema.Types.ObjectId,
        ref: "RecordStatus"
    }

},  { timestamps : true });

module.exports = mongoose.model('ClinicSchedule', clinicScheduleSchema);

// 1, "MWF Schedule (OPEN-MOR)", "MWF Schedule (OPEN-MOR)", "2021-03-08", "SCHED_REPEAT_WEEKLY", "2021-12-31", "09:00", "11:30", "25", "SCHED_OPEN", TRUE, 10
// 2, "MWF Schedule (OPEN-AFT)", "MWF Schedule (OPEN-AFT)", "2021-03-08", "SCHED_REPEAT_WEEKLY", "2021-12-31", "09:00", "11:30", "25", "SCHED_OPEN", TRUE, 10
// 3, "SU-TU-TH-SA (CLOSED)", "SU-TU-TH-SA (CLOSED)", "2021-03-09", "SCHED_REPEAT_WEEKLY", "2021-12-31", "00:00", "11:59", "0", "SCHED_CLOSE", TRUE, 10
// 4, "Temp Closed (Mar-30)", "Temp Closed (Mar-30)", "2021-03-30", "SCHED_REPEAT_NONE", "2021-12-31", "00:00", "11:59", "SCHED_CLOSE", TRUE, 10