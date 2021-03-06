const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clinicScheduleSchema = new Schema({
    schedDate: {
        type: Date
    },
    schedDay: {
        type: String,
        required: true,
        max: 3
    },
    schedStartTime: {
        type: String,
        required: true,
        max: 255
    },
    schedEndTime: {
        type: String,
        required: true,
        max: 255
    }
},{ timestamps: true });

//note: modelname is saved to mongodb atlas
module.exports = mongoose.model('ClinicSchedule', clinicScheduleSchema) //params: modelname, schema
