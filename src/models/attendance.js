const mongoose = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');


const attendanceSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    date: schemaFields.requiredAndDate,
    checkIn: schemaFields.requiredAndDate,
    checkOut: schemaFields.requiredAndDate,
    location: schemaFields.requiredAndString,
    status: {
        type: String,
        enum: ['Present', 'Absent', 'On Leave', 'Half Day'],
        required: true,
        default: 'Present'
    },
    islate: schemaFields.BooleanWithDefault,
    comments: schemaFields.requiredAndString,
    createdBy:schemaFields.UUIDIdReference('superAdmin'),
    permission:{
        type: String,
        enum: ["read"],
        default: ()=>{
            return this.role === 'superAdmin'?'full-access':'write'
        }
    },
},{timestamps:true, collection: "Attendance"});

const AttendanceModel = mongoose.model('Attendance',attendanceSchema);

module.exports = AttendanceModel;

