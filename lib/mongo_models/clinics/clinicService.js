const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clinicServiceSchema = new Schema({
    cServiceName: {
        type: String,
        required: true,
        max: 255
    },
    cServicePrice: {
        type: String,
        required: true,
        min: 8,
        max: 1024
    },
},{ timestamps: true });

//note: modelname is saved to mongodb atlas
module.exports = mongoose.model('ClinicService', clinicServiceSchema) //params: modelname, schema
