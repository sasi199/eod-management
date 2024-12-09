const mongoose = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');


const staffSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    staffId: schemaFields.requiredAndString,
    password: schemaFields.requiredAndString,
    fullName: schemaFields.requiredAndString,
    profetionalEmail: schemaFields.requireStringAndUnique,
    personalEmail: schemaFields.requireStringAndUnique,
    dob:schemaFields.requiredAndString,
    phoneNumber:schemaFields.requireNumberAndUnique, 
    profilePic: schemaFields.requiredAndString,
    gender: schemaFields.requiredAndString,
    permanentAddress: schemaFields.requiredAndString,
    currentAddress: schemaFields.requiredAndString,
    isActive: schemaFields.BooleanWithDefault,
    designation:schemaFields.UUIDIdReference('Designation'),
    qualification:schemaFields.requiredAndString,
    experience: schemaFields.StringWithEnumAndRequired(['0 to 1 year', '1 to 3 years', '3 to 5 years', '5+']),
    role: schemaFields.UUIDIdReference('Role'),
    dateOfJoining: schemaFields.requiredAndString,
    department_id: schemaFields.UUIDIdReference('Department'),
    company_id: schemaFields.UUIDIdReference('Company'),
    isTrainer: schemaFields.BooleanWithDefault,
    createdBy:schemaFields.UUIDIdReference('superAdmin'),
    isArchive: schemaFields.BooleanWithDefault,
    hybrid: schemaFields.StringWithEnumAndRequired(['Online','Offline','WFH']),
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

