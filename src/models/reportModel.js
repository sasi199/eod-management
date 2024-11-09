const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");


const reportSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    title: schemaFields.requiredAndString,
    content: schemaFields.requiredAndString,
    reporter: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Auth', 
        required: true 
    },
    reportTo: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Auth', 
        required: true 
    },

},{timestamps:true, collection:"Report"});


const ReportModel = mongoose.model("Report",reportSchema);

module.exports = ReportModel;