const mongoose = require('mongoose');
const { Schema } = mongoose;
const { RECORD_STATUS } = require('../../utilities/config');

module.exports = mongoose.model(
    'ClinicInfo',
    new Schema({

        // info
        clinic_name: {
            type: String,
            required: true,
            max: 255
        },
        clinic_short_description: {
            type: String,
            required: false,
            max: 100
        },
        clinic_long_description: {
            type: String,
            max: 255,
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

        clinic_address: {
            type: Schema.Types.ObjectId,
            required: false
        },

        // type of clinic (dental, surgery, medical, radiology)
        clinic_types: {
            type: [Schema.Types.ObjectId],
            ref: "ClinicType",
            required: true
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
        clinic_create_by_admin_id: {
            type: Schema.Types.ObjectId,
            ref: "AdminInfo"
        },
        clinic_create_status: {
            type: Number,
            required: true,
            default: RECORD_STATUS.ACTIVE
        }
    }, { timestamps: true })
);
