const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RECORD_STATUS } = require('../../utilities/config');

module.exports = mongoose.model(
    'UserInfo',
    new Schema({

        user_email: {
            type: String,
            required: true,
            max: 255
        },

        user_password: {
            type: String,
            required: false,
            min: 8,
            max: 60
        },

        user_first_name: {
            type: String,
            required: true,
            max: 255
        },

        user_middle_name: {
            type: String,
            required: false,
            max: 255
        },

        user_last_name: {
            type: String,
            required: true,
            max: 255
        },

        user_contact_number: {
            type: String,
            required: true,
            max: 15
        },

        user_birth_date: {
            type: Date,
            required: true
        },

        user_image: {
            type: Schema.Types.ObjectId,
            ref: "ImageInfo",
            required: false
        },

        user_token: {
            type: String,
            required: false,
            max: 6,
        },

        user_token_expire_date: {
            type: Date,
            required: false
        },

        user_prefix: {
            type: String, // Mr. Mrs. Sr.
            required: false
        },

        user_suffix: {
            type: String, // Ph.D, M.D., Sr.
            required: false
        },

        user_profession: {
            type: String,
            required: false
        },

        user_address: {
            type: Schema.Types.ObjectId,
            ref: "AddressInfo"
        },

        user_social_logins: {
            type: [Schema.Types.ObjectId],
            ref: "UserSocialLogin"
        },
        
        user_login_attempts: {
            type: Number,
            default: 0
        },

        user_verified_email: {
            type: Boolean,
            default: false
        },

        staff_last_login_date: {
            type: Date
        },

        user_create_status: {
            type: Number,
            required: false,
            default: RECORD_STATUS.ACTIVE
        },

        user_create_by_user_id: {
            type: Schema.Types.ObjectId,
            ref: "UserInfo"
        }
    }, { timestamps: true })
);