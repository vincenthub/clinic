const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clinicServiceSchema = new Schema({

    clinic_service_name: {
        type: String, required: true
    },
    clinic_service_description: {
        type: String, required: true
    },
    clinic_service_create_by_user_id: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    clinic_service_create_status: Number

},{ timestamps: true });

//note: modelname is saved to mongodb atlas
module.exports = mongoose.model('ClinicService', clinicServiceSchema) //params: modelname, schema
