const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model(
    'PermissionInfo',
    new Schema({

        permission_name: {
            type: String,
            required: true
        },
        permission_description: {
            type: String,
            required: true
        },
        permission_type: {
            type: Schema.Types.ObjectId,
            ref: "PermissionType"
        },
        permission_options: {
            type: [Schema.Types.ObjectId],
            ref: "PermissionOption"
        },
        permission_create_status: {
            type: Schema.Types.ObjectId,
            ref: "RecordStatus"
        },
        permission_create_by_user_id: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }

    },{ timestamps: true })
);