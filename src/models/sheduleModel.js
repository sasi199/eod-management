const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");

const scheduleSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    batch: {
        type: String,
        ref: 'Batch',
        required: true,
    },
    date:{
        type: Date,
        required: true
    },
    timeTable: [{
            type: String,
            ref: 'TimeTable',
        }],
    
}, { timestamps: true, collection: 'Schedule' });

const ScheduleModel = mongoose.model('Schedule', scheduleSchema);

module.exports = ScheduleModel;
