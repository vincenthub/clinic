const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clinicTypeSchema = new Schema({
    clinic_type_name: {
        type: String,
        required: true
    },
    clinic_type_description: {
        type: String,
        required: false
    },
    clinic_type_create_by_user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    clinic_type_create_status: {
        type: Schema.Types.ObjectId,
        ref: "RecordStatus"
    }
},{ timestamps: true });

module.exports = mongoose.model('ClinicType', clinicTypeSchema);
