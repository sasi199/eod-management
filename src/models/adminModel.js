const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");


const adminSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    adminId:schemaFields.requiredAndString,
    fullName: schemaFields.requiredAndString,
    email: schemaFields.requireStringAndUnique, 
    profilePic: schemaFields.requiredAndString,
    isActive: schemaFields.BooleanWithDefault,
    hybrid: schemaFields.StringWithEnumAndRequired(['Online','Offline','WFH']),
    role: schemaFields.UUIDIdReference('Role'),
    isArchive: schemaFields.BooleanWithDefault,
},{timestamps: true, collection: "Admin"});

const AdminModel = mongoose.model('Admin',adminSchema);

module.exports = {AdminModel};