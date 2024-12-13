const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");


const leaveSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    userId: {
        type: String,
        ref: 'Auth',
        required: true
    },
    date: schemaFields.requiredAndString,
    endDate: {
        type: String
    },
    leaveType: {
        type: String,
        enum: ['sick', 'casual', 'annual','permission','wfh','online'],
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'unApproved','rejected'],
        default: 'pending'
    },
    reason: schemaFields.requiredAndString,
},{timestamps:true,collection:'LeaveApply'});

const LeaveApplyModel = mongoose.model('LeaveApply',leaveSchema);

module.exports = LeaveApplyModel;