const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");


const scheduleSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    batchId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Batch',
        required: true,
    },
    trainerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Staff',
        required: true,
    },
    // traineeId: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'Trainee',
    //     required: true,
    // },
    subject: schemaFields.requiredAndString,
    batchTimings: schemaFields.StringWithEnumAndRequired([
        '10 am to 11 am',
        '11 am to 12 pm',
        '10 am to 12 pm',
        '11 am to 11 pm',
        '02 am to 03 pm',
        '03 am to 05 pm',
        '02 am to 04 pm',
        '04 am to 06 pm',
    ]),
    date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['scheduled', 'completed', 'canceled'],
        default: 'scheduled',
    },

},{timestamps:true,collection:'Schedule'})

const ScheduleModel = mongoose.model('Schedule',scheduleSchema);

module.exports = ScheduleModel;