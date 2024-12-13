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
    department: schemaFields.StringWithEnumAndRequired([
        'FSD-Trainee',
        'DM-Trainee',
    ]),
    qualification:schemaFields.requiredAndString,
    experience: schemaFields.StringWithEnumAndRequired(['0 to 1 year', '1 to 3 year', '3 to 5', '5+']),
    role: schemaFields.StringWithEnumAndRequired(["Admin","SuperAdmin","Trainer","Trainee"]),
    isActive: schemaFields.BooleanWithDefault,
    createdBy:schemaFields.UUIDIdReference('superAdmin'),
    isArchive: schemaFields.BooleanWithDefault,
    // resumeUpload: schemaFields.requiredAndString,
    // designation:schemaFields.requiredAndString,
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

