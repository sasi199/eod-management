const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");
const { string } = require('joi');


const reportSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    title: schemaFields.requiredAndString,
    content: schemaFields.requiredAndString,
    reporter: { 
        type: String, 
        ref: 'Auth', 
        required: true 
    },
    reportTo: { 
        type: String, 
        ref: 'Auth', 
        required: true 
    },
    status: {
        type: String,
        enum: ["unRead", "Readed",],
        default: "unRead",
    },
    replay:{
        type: String
    },
    reviewedAt: {
        type: Date,
    },

},{timestamps:true, collection:"Report"});


const ReportModel = mongoose.model("Report",reportSchema);

module.exports = ReportModel;