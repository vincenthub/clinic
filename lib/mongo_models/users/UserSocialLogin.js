const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model(
    'UserSocialLogin',
    new Schema({

        user_social_login_id: {
            type: String,
            required: true,
            max: 255
        },
        // config.js SOCIAL_LOGIN
        user_social_login_method: {
            type: Number,
            required: true
        },
        user_social_login_create_status: {
            type: Number,
            required: true
        },
        user_social_login_create_by: {
            type: Schema.Types.ObjectId,
            ref: "UserInfo",
            required: true
        }

    }, { timestamps: true })
);