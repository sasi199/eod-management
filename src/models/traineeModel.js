const mongoose = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');


const traineeSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    logId: schemaFields.requiredAndString,
    fullName: schemaFields.requiredAndString,
    email: schemaFields.requireStringAndUnique,
    dob:schemaFields.requiredAndString,
    phoneNumber:schemaFields.requireNumberAndUnique, 
    profilePic: schemaFields.requiredAndString,
    gender: schemaFields.requiredAndString,
    permanentAddress: schemaFields.requiredAndString,
    currentAddress: schemaFields.requiredAndString,
    resumeUpload: schemaFields.requiredAndString,
    isActive: schemaFields.BooleanWithDefault,
    // designation:schemaFields.requiredAndString,
    qualification:schemaFields.requiredAndString,
    experience: schemaFields.StringWithEnumAndRequired(['0 to 1', '1 to 3', '3 to 5', '5+']),
    role: schemaFields.StringWithEnumAndRequired(["Admin","SuperAdmin","Trainer","Trainee"]),
    createdBy:schemaFields.UUIDIdReference('superAdmin'),
    isArchive: schemaFields.BooleanWithDefault,
    permission:{
        type: String,
        enum: ["read","write"],
        default: ()=>{
            return this.role === 'superAdmin'?'full-access':'write';
        }
    },
},{timestamps:true, collection: "Trainee"});

const TraineeModel = mongoose.model('Trainee',traineeSchema);

module.exports = TraineeModel;

