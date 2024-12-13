const mongoose = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');


const traineeDetailsSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    traineeId: schemaFields.requiredAndString,
    accountHolderName: schemaFields.requiredAndString,
    accountNumber: schemaFields.requiredAndString,
    bankName: schemaFields.requiredAndString,
    ifscCode: schemaFields.requiredAndString,
    branch: schemaFields.requiredAndString,
    fatherName: schemaFields.requiredAndString,
    motherName: schemaFields.requiredAndString,
    guardian: schemaFields.requiredAndString,
    contact: schemaFields.requiredAndString,
    assignedSchedule:[{
        type: String,
        ref: 'Schedule'
    }]

},{timestamps:true, collection:"TraineeDetails"});


const TraineeDetailsModel = mongoose.model("TraineeDetails",traineeDetailsSchema);

module.exports = TraineeDetailsModel;