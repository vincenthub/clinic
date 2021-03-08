const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { RECORD_STATUS } = require('../../utilities/config');

const addressInfoSchema = new Schema({

    address_building_number: {
        type: String,
        required: true,
        max: 255
    },
    address_street_name: {
        type: String,
        required: true,
        max: 255
    },
    address_barangay: {
        type: String,
        required: true,
        max: 255
    },
    address_municipality: {
        type: String,
        required: true,
        max: 255
    },
    address_city: {
        type: String,
        required: true,
        max: 255
    },
    address_province: {
        type: String,
        required: true,
        max: 255
    },
    address_postal_code: {
        type: String,
        required: true,
        max: 8
    },
    address_country_name: {
        type: String,
        required: true,
        max: 255
    },
    address_country_code: {
        type: String,
        required: true,
        max: 2
    },
    address_latitude: {
        type: String,
        required: true,
        max: 255
    },
    address_longitude: {
        type: String,
        required: true,
        max: 255
    },
    address_create_status: {
        type: Number,
        required: false,
        default: RECORD_STATUS.ACTIVE
    },
    address_create_by_user_id: {
        type: Schema.Types.ObjectId,
        ref: "UserInfo"
    }

},{ timestamps: true });

module.exports = mongoose.model('AddressInfo', addressInfoSchema);
