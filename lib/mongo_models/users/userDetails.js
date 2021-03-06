const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userDetailsSchema = new Schema({
    appUserID: {
        type: Schema.Types.ObjectId, 
        ref: 'AppUsers',
    },
    firstName: {
        type: String,
        required: true,
        max: 255
    },
    lastName: {
        type: String,
        required: true,
        max: 255
    },
    mobileNumber: {
        type: String,
        required: true,
        max: 15
    },
    address: {
        type: Schema.Types.ObjectId, 
        ref: 'AddressDetails',
        required: false
    }
},{ timestamps: true });

//note: modelname is saved to mongodb atlas
module.exports = mongoose.model('UserDetails', userDetailsSchema) //params: modelname, schema
