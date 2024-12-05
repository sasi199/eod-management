const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");
const { date } = require('joi');


const eodSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    userName:{
        type: String,
        ref:'Auth'
    },
    department: schemaFields.requiredAndString,
    uploadFile:{
        type: [String],
        required: true,
    },
    description: schemaFields.requiredAndString,
    link:{
        type:[String],
    },
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