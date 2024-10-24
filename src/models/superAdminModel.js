const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");


const adminSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    email: schemaFields.requireStringAndUnique,
    mobileNumber:schemaFields.requireNumberAndUnique, 
    password: schemaFields.requiredAndString,
    role: schemaFields.StringWithEnumAndRequired(["admin","superAdmin"]),
    // createdBy:schemaFields.UUIDIdReference('Admin'),
    isArchive: schemaFields.BooleanWithDefault,
    permission:{
        type: String,
        enum: ["read","write","manage","full-access"],
        default: ()=>{
            return this.role === 'superAdmin'?'full-access':'write'
        }
    },
},{timestamps: true, collection: "SuperAdmin"});

const SuperAdminModel = mongoose.model('SuperAdmin',adminSchema);

module.exports = SuperAdminModel;