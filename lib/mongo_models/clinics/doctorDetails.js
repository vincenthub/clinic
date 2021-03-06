const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const doctorDetailsSchema = new Schema({
    doctorName: {
        type: String,
        required: true,
        max: 255
    },
    doctorTitleId: {
        type: [{
            type: Schema.Types.ObjectId, ref: 'DoctorTitle',
        }],
        required: true,
        min: 1  
    }
},{ timestamps: true });

//note: modelname is saved to mongodb atlas
module.exports = mongoose.model('DoctorDetails', doctorDetailsSchema) //params: modelname, schema
