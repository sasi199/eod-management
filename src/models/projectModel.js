const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");
const { string } = require('joi');

const projectSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    projectName: schemaFields.requiredAndString,
    department: schemaFields.requiredAndString,
    userId:{
        type: String,
        ref: 'Staff'
    },
    description:{
        type: String
    },
    task:{
        type: String,
        ref: "Task"
    } 
},{timestamps: true, collection:"Project"})

const ProjectModel = mongoose.model("Project",projectSchema);

module.exports = ProjectModel;