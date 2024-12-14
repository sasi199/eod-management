const mongoose = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');
const { required } = require('joi');


const attendanceSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    date: String,
    dateString: String,
    checkIn:{
        type: Date,
    },
    user: {
        type: String,
        ref: 'Auth',
        required: true,
    },
    
    checkOut:{
        type: Date,
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
        enum: ['Present', 'Absent', 'WFH', 'Half-Day','Online','Late'],
        required: true,
        default: 'Present'
    },
    islate: schemaFields.BooleanWithDefault,
    isApprovedLeave: schemaFields.BooleanWithDefault,
    isApprovedPermission: schemaFields.BooleanWithDefault,
    isApprovedCompoff: schemaFields.BooleanWithDefault,
    isApprovedWFH: schemaFields.BooleanWithDefault,
    isApprovedOnline: schemaFields.BooleanWithDefault,
    modifiedBy:[{
        type: String,
        ref: 'Auth',
    }],
    // permission:{
    //     type: String,
    //     enum: ["write"],
    //     default: ()=>{
    //         return this.role === 'superAdmin'?'full-access':'write'
    //     }
    // },
},{timestamps:true, collection: "Attendance"});

// attendanceSchema.pre('save', function (next) {
//     if (this.createdBy.role === 'superAdmin') {
//         this.permission = 'full-access';
//     } else {
//         this.permission = 'write';
//     }
//     next();
// });

const AttendanceModel = mongoose.model('Attendance',attendanceSchema);

module.exports = AttendanceModel;

