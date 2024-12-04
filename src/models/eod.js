const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");
const { date } = require('joi');


const eodSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    userName: schemaFields.requiredAndString,
    department: schemaFields.requiredAndString,
    uploadFile: schemaFields.requiredAndString,
    descrption: schemaFields.requiredAndString,
    project:{
        type:String,
        ref:'Project'
    },
    date:{
        type: Date,
        default: Date.now,
    }
},{timestamps:true,collection:'Eod'});

const EodModel = mongoose.model('Eod',eodSchema);

module.exports = EodModel;