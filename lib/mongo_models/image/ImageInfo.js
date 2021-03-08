const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model(
    'ImageInfo',
    new Schema({

        image_name: {
            type: String,
            required: true
        },
        image_description: {
            type: String,
            required: false
        },
        image_url: {
            type: String,
            required: true
        },
        image_dimension_x: {
            type: Number,
            required: true
        },
        image_dimension_y: {
            type: Number,
            required: true
        },
        image_create_status: {
            type: Schema.Types.ObjectId,
            ref: "RecordStatus"
        },
        image_create_by_user_id: {
            type: Schema.Types.ObjectId,
            ref: "User"
        }

    },{ timestamps: true })
);