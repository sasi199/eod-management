const mongoose = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');


const staffSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    logId: schemaFields.requiredAndString,
    password: schemaFields.requiredAndString,
    fullName: schemaFields.requiredAndString,
    email: schemaFields.requireStringAndUnique,
    dob:schemaFields.requiredAndString,
    phoneNumber:schemaFields.requireNumberAndUnique, 
    profilePic: schemaFields.requiredAndString,
    gender: schemaFields.requiredAndString,
    address: schemaFields.requiredAndString,
    isActive: schemaFields.BooleanWithDefault,
    designation:schemaFields.requiredAndString,
    qualification:schemaFields.requiredAndString,
    experience: schemaFields.StringWithEnumAndRequired(['0 to 1', '1 to 3', '3 to 5', '5+']),
    role: schemaFields.StringWithEnumAndRequired(["Admin","HR","Coordinator","Employee"]),
    isTrainer: schemaFields.BooleanWithDefault,
    createdBy:schemaFields.UUIDIdReference('superAdmin'),
    isArchive: schemaFields.BooleanWithDefault,
    hybrid: schemaFields.StringWithEnumAndRequired(['Online','WFH']),
    permission:{
        type: String,
        enum: ["read","write","manage","full-access"],
        default: ()=>{
            return this.role === 'superAdmin'?'full-access':'write'
        }
    },
},{timestamps:true, collection: "Staff"});

const StaffModel = mongoose.model('Staff',staffSchema);

module.exports = StaffModel;

