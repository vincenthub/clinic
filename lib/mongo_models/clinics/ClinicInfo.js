const mongoose = require('mongoose');
const { Schema } = mongoose;

module.exports = mongoose.model(
    'ClinicInfo',
    new Schema({

        // info
        clinic_name: {
            type: String,
            required: true
        },
        clinic_short_description: {
            type: String,
            required: false
        },
        clinic_long_description: {
            type: String,
            required: true
        },
        // clinic logo
        clinic_logo: {
            type: Schema.Types.ObjectId,
            ref: "ImageInfo"
        },
        // clinic images
        clinic_images: {
            type: [Schema.Types.ObjectId],
            ref: "ImageInfo"
        },

        // TODO: create separate object
        clinic_address: {
            type: Schema.Types.ObjectId,
            required: true
        },
        // --

        // type of clinic (dental, surgery, medical, radiology)
        clinic_types: {
            type: [Schema.Types.ObjectId],
            ref: "ClinicType"
        },

        // staff
        clinic_staffs: {
            type: [Schema.Types.ObjectId],
            ref: "StaffInfo"
        },

        // schedules:
        clinic_schedules: {
            type: [Schema.Types.ObjectId],
            ref: "ClinicSchedule"
        },

        // services:
        clinic_services: {
            type: [Schema.Types.ObjectId],
            ref: "ClinicService"
        },

        clinic_published: {
            type: Boolean,
            required: true,
            default: false
        },
        // history:
        clinic_create_by_user_id: {
            type: Schema.Types.ObjectId,
            ref: "User"
        },
        clinic_create_status: {
            type: Number,
            required: true
        }
    }, { timestamps: true })
);