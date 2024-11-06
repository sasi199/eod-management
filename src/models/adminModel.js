const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");


const adminSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    logId:schemaFields.requiredAndString,
    email: schemaFields.requireStringAndUnique,
    phoneNumber:schemaFields.requireNumberAndUnique, 
    fullName: schemaFields.requiredAndString,
    profilePic: schemaFields.requiredAndString,
    gender: schemaFields.requiredAndString,
    address: schemaFields.requiredAndString,
    isActive: schemaFields.BooleanWithDefault,
    role: schemaFields.requiredAndString,
    // role: schemaFields.StringWithEnumAndRequired(["admin","superAdmin"]),
    createdBy:schemaFields.UUIDIdReference('superAdmin'),
    isArchive: schemaFields.BooleanWithDefault,
    permission:{
        type: String,
        enum: ["read","write","manage","full-access"],
        default: ()=>{
            return this.role === 'superAdmin'?'full-access':'write'
        }
    },
},{timestamps: true, collection: "Admin"});

const AdminModel = mongoose.model('Admin',adminSchema);

module.exports = {AdminModel};