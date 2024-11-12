const mongoose = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');
const { ref } = require('joi');


const trainerSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    logId: schemaFields.requiredAndString,
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
    assignedBatches: [{
        type: String,
        ref: 'Batch'
    }],
    assignedSchedule: [{
        type: String,
        ref: 'Schedule'
    }],
    experience: schemaFields.StringWithEnumAndRequired(['0 to 1', '1 to 3', '3 to 5', '5+']),
    role: schemaFields.StringWithEnumAndRequired(["Admin","SuperAdmin","Trainer","Trainee"]),
    createdBy:schemaFields.UUIDIdReference('superAdmin'),
    isArchive: schemaFields.BooleanWithDefault,
    permission:{
        type: String,
        enum: ["read"],
        default: ()=>{
            return this.role === 'superAdmin'?'full-access':'read'
        }
    },
},{timestamps:true, collection: "Trainer"});

const TrainerModel = mongoose.model('Trainer',trainerSchema);

module.exports = TrainerModel;

