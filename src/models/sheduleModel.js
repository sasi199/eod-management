const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");


const scheduleSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    scheduleId: schemaFields.idWithV4UUID,

},{timestamps:true,collection:'Schedule'})

const ScheduleModel = mongoose.model('Schedule',scheduleSchema);

module.exports = ScheduleModel;