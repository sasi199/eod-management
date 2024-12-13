const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");

const studentAttendanceSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    batch:{
        type:String,
        ref:'AssignedBatch'
    }
},{timestamps:true,collection:'StudentAttendance'});

const StudentAttendanceModel = mongoose.model('StudentAttendance',studentAttendanceSchema);

module.exports = StudentAttendanceModel;