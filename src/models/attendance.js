const mongoose = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');


const attendanceSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    date: schemaFields.requiredAndDate,
    checkIn: schemaFields.requiredAndDate,
    checkOut:{
        type: Date,
        required: false,
    },
    location:{
        type: {
            latitude: { type: Number, required: true },
            longitude: { type: Number, required: true }
        },
        required: true
    },
    status: {
        type: String,
        enum: ['Present', 'Absent', 'WFH', 'Off-Day','1 hour','Online'],
        required: true,
        default: 'Present'
    },
    islate: schemaFields.BooleanWithDefault,
    comments: {...schemaFields.requiredAndString},
    createdBy:schemaFields.UUIDIdReference('superAdmin'),
    permission:{
        type: String,
        enum: ["write"],
        default: ()=>{
            return this.role === 'superAdmin'?'full-access':'write'
        }
    },
},{timestamps:true, collection: "Attendance"});

attendanceSchema.pre('save', function (next) {
    if (this.createdBy.role === 'superAdmin') {
        this.permission = 'full-access';
    } else {
        this.permission = 'write';
    }
    next();
});

const AttendanceModel = mongoose.model('Attendance',attendanceSchema);

module.exports = AttendanceModel;

