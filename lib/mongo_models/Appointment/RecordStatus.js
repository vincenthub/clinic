const mongoose = require('mongoose');
const { Schema } = mongoose;

const recordStatusSchema = new Schema({

    // RECORD_STATUS_ACTIVE, RECORD_STATUS_DELETED
    record_status_name: String

}, { timestamps : true });

module.exports = mongoose.model('RecordStatus', recordStatusSchema);