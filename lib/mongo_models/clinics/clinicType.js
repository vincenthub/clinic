const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clinicTypeSchema = new Schema({
    cTypeName: {
        type: String,
        required: true,
        max: 255
    }
},{ timestamps: true });

//note: modelname is saved to mongodb atlas
module.exports = mongoose.model('ClinicType', clinicTypeSchema) //params: modelname, schema
