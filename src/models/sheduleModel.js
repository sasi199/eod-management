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
    timiTable: [
        {
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
        },
    ],
    isSchedule:{
        
    }
}, { timestamps: true, collection: 'Schedule' });

const ScheduleModel = mongoose.model('Schedule', scheduleSchema);

module.exports = ScheduleModel;
