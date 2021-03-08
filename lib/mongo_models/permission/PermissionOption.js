const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model(
    'PermissionOption',
    new Schema({

        permission_option_name: String,
        permission_option_description: String,
        permission_option_selected: Boolean,
        permission_option_create_status: {
            type: Schema.Types.ObjectId,
            ref: "RecordStatus"
        },
        permission_option_create_by_user_id: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }

    },{ timestamps: true })
);