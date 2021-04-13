const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RECORD_STATUS } = require('../../utilities/config');

module.exports = mongoose.model(
    'AdminInfo',
    new Schema({

        admin_email: {
            type: String,
            required: true,
            max: 255
        },
        admin_username: {
            type: String,
            required: true,
            max: 255
        },
        admin_password: {
            type: String,
            required: false,
            min: 8,
            max: 60
        },
        admin_first_name: {
            type: String,
            required: true,
            max: 255
        },
        admin_middle_name: {
            type: String,
            required: false,
            max: 255
        },
        admin_last_name: {
            type: String,
            required: false,
            max: 255
        },
        admin_contact_number: {
            type: String,
            required: true,
            max: 15
        },
        admin_birth_date: {
            type: Date,
            required: false
        },
        admin_image: {
            type: Schema.Types.ObjectId,
            ref: "ImageInfo",
            required: false
        },
        admin_token: {
            type: String,
            required: false,
            max: 6,
        },
        admin_token_expire_date: {
            type: Date,
            required: false
        },
        admin_permission: {
            type: Schema.Types.ObjectId,
            ref: "PermissionCollection" //To Do
        },
        admin_prefix: {
            type: String, // Mr. Mrs. Sr.
            required: false
        },
        admin_suffix: {
            type: String, // Ph.D, M.D., Sr.
            required: false
        },
        admin_address: {
            type: Schema.Types.ObjectId,
            ref: "AddressInfo"
        },
        admin_password_expiry_date: {
            type: Date, 
            required: false
        },
        admin_social_logins: {
            type: [Schema.Types.ObjectId],
            ref: "UserSocialLogin"
        },

        admin_create_status: {
            type: Number,
            required: false,
            default: RECORD_STATUS.ACTIVE
        },

        admin_create_by_admin_id: {
            type: Schema.Types.ObjectId,
            ref: "UserInfo"
        }
    }, { timestamps: true })
);