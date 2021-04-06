const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model('UnverifiedContactNumber',
    new Schema({
        contact_number: {
            type: Number,
            required: true,
            maxlength: 12
        },
        verification_code: {
            type: Number,
            required: true,
            maxlength: 6
        }
    }, { timestamps: true })
);
