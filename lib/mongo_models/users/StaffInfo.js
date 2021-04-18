const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RECORD_STATUS } = require('../../utilities/config');

module.exports = mongoose.model(
    'StaffInfo',
    new Schema({

        staff_email: {
            type: String,
            required: true,
            max: 255
        },

        staff_password: {
            type: String,
            required: false,
            min: 8,
            max: 1024
        },

        staff_first_name: {
            type: String,
            required: true,
            max: 255
        },

        staff_middle_name: {
            type: String,
            required: false,
            max: 255
        },

        staff_last_name: {
            type: String,
            required: false,
            max: 255
        },

        staff_contact_number: {
            type: String,
            required: true,
            max: 15
        },

        staff_birth_date: {
            type: Date,
            required: false
        },

        staff_image: {
            type: Schema.Types.ObjectId,
            ref: "ImageInfo",
            required: false
        },

        staff_token: {
            type: String,
            required: false,
            max: 6,
        },

        staff_token_expire_date: {
            type: Date,
            required: false
        },

        staff_permission: {

        },

        staff_prefix: {
            type: String, // Mr. Mrs. Sr.
            required: false
        },

        staff_suffix: {
            type: String, // Ph.D, M.D., Sr.
            required: false
        },

        staff_profession: {
            type: String,
            required: false
        },

        staff_is_physician: {
            type: Boolean,
            required: true,
            default: false,
        },

        staff_address: {
            type: Schema.Types.ObjectId,
            ref: "AddressInfo"
        },

        staff_password_expiry_date: {
            type: Date, 
            required: false
        },

        staff_verified_email: {
            type: Boolean,
            default: false
        },

        staff_login_attempts: {
            type: Number,
            default: 0
        },

        staff_is_temp_password: {
            type: Boolean,
            default: true
        },

        staff_last_login_date: {
            type: Date
        },

        staff_social_logins: {
            type: [Schema.Types.ObjectId],
            ref: "UserSocialLogin"
        },

        staff_create_status: {
            type: Number,
            default: RECORD_STATUS.ACTIVE
        },

        staff_create_by_staff_id: {
            type: Schema.Types.ObjectId,
            ref: "UserInfo"
        }
    }, { timestamps: true })
);