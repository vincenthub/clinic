const mongoose = require('mongoose');
const AddressInfo = require('../users/AddressInfo');
const UserInfo = require('../users/UserInfo');
const PermissionInfo = require('./PermissionInfo');
const { Schema } = mongoose;

module.exports = mongoose.model(
    'PermissionCollection',
    new Schema({

    user_id: {
        type: Schema.Types.ObjectId,
        ref: "UserInfo"
    },

    restricted: Boolean,

    permissions: {
        type: [{
            permssion_Name: String,
            permission_Status: Boolean
        }],
        require: true
    },

    },{ timestamps: true })
);
