const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model(
    'PermissionType',
    new Schema({

        permission_type_name: {
            type: String,
            required: true
        },
        permission_type_description: {
            type: String,
            required: false
        },
        permission_type_create_status: {
            type: Schema.Types.ObjectId,
            ref: "RecordStatus"
        },
        permission_type_create_by_user_id: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }

    },{ timestamps: true })
);