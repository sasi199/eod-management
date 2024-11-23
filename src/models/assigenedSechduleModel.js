const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");


const AssignedScheduleSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    scheduleId: schemaFields.requiredAndString,
    trainer:[{
        type: String,
        ref: "batch"
    }]
},{timestamps:true,collection:"AssignedSchedule"});