const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");

const syllabusSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    courseName: schemaFields.requiredAndString,
    subjectName: schemaFields.requiredAndString,
    uploadFile: schemaFields.requiredAndString,
},{timestamps:true,collection:"Syllabus"});

const SyllabusModel = mongoose.model("Syllabus",syllabusSchema);

module.exports = SyllabusModel;