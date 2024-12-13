const mongoose = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');


const traineeSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    traineeId: schemaFields.requiredAndString,
    batch:{
        type: String,
        ref:"Batch",
        required: true
    },
    password : schemaFields.requiredAndString,
    fullName: schemaFields.requiredAndString,
    email: schemaFields.requireStringAndUnique,
    dob:schemaFields.requiredAndString,
    phoneNumber:schemaFields.requireNumberAndUnique, 
    profilePic: schemaFields.requiredAndString,
    gender: schemaFields.requiredAndString,
    permanentAddress: schemaFields.requiredAndString,
    currentAddress: schemaFields.requiredAndString,
    grossSalary: schemaFields.requiredAndString,
    uanNumber: String,
    pfNumber: String,
    esiNumber: String,
    hybrid: schemaFields.StringWithEnumAndRequired(['Online','Offline','WFH']),
    department: schemaFields.UUIDIdReference("Department"),
    qualification:schemaFields.requiredAndString,
    experience: schemaFields.StringWithEnumAndRequired(['0 to 1 year', '1 to 3 year', '3 to 5', '5+']),
    role: schemaFields.UUIDIdReference('Role'),
    isActive: schemaFields.BooleanWithDefault,
    createdBy:schemaFields.UUIDIdReference('Staff'),
    isArchive: schemaFields.BooleanWithDefault,
    // resumeUpload: schemaFields.requiredAndString,
    // designation:schemaFields.requiredAndString,
},{timestamps:true, collection: "Trainee"});

const TraineeModel = mongoose.model('Trainee',traineeSchema);

module.exports = TraineeModel;

