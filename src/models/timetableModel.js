const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");

const timeTableSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    scheduleId: {
        type: String,
        ref: 'Schedule',
        required: true,
    },
    trainer: {
        type: String,
        ref: 'Staff',
        required: true,
    },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    subject: {
        type: String,
        enum: [
            'Html/Css',
            'Javascript',
            'Bootstrap',
            'Jquery',
            'React.js',
            'Node.js/Mongodb',
            'Python',
            'Php',
            'Figma',
        ],
        required: true,
    },
    status: {
        type: String,
        enum: ['not started', 'ongoing', 'completed'],
        default: 'not started',
    },
}, { timestamps: true, collection: 'TimeTable' });

const TimeTableModel = mongoose.model('TimeTable', timeTableSchema);

module.exports = TimeTableModel;
