const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const addressDetailsSchema = new Schema({
    adrsBuildingHouseNumber: {
        type: String,
        required: true,
        max: 255
    },
    adrsStreet: {
        type: String,
        required: true,
        max: 255
    },
    adrsBarangay: {
        type: String,
        required: true,
        max: 255
    },
    adrsCityTown: {
        type: String,
        required: true,
        max: 255
    },
    adrsProvice: {
        type: String,
        required: true,
        max: 255
    },
    adrsPostalCode: {
        type: String,
        required: true,
        max: 255
    },
    adrLatitude: {
        type: String,
        required: true,
        max: 255
    },
    adrLongitude: {
        type: String,
        required: true,
        max: 255
    }
},{ timestamps: true });

//note: modelname is saved to mongodb atlas
module.exports = mongoose.model('AddressDetails', addressDetailsSchema) //params: modelname, schema
