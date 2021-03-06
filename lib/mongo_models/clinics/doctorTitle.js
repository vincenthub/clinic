const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorTitleSchema = new Schema({
    dTitleName: {
        type: String,
        required: true,
        max: 255
    }
},{ timestamps: true });

//note: modelname is saved to mongodb atlas
module.exports = mongoose.model('DoctorTitle', doctorTitleSchema) //params: modelname, schema
