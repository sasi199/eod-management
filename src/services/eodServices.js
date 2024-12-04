const Auth = require("../models/authModel");
const EodModel = require("../models/eod");
const ProjectModel = require("../models/projectModel");
const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');


exports.createEod = async(req)=>{
    const { project, department,} = req.body
    const { accountId } = req

    const projects = await ProjectModel.findOne({projectName:project});
    if (projects) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Project not found"});
    }

    const user = await Auth.findOne({accountId});
    if (user) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "User not found"});
    }

    let uploadedFiles = [];
    if (req.files && req.files.length > 0) {
        for (const file of req.files) {
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExtension}`;
            const uploadedFile = await uploadCloud(`Eod/${fileName}`, file);
            uploadedFiles.push(uploadedFile); 
        }
    }

    const newEod = new EodModel({
        project,
        userName: accountId.accountId,
        department,
        uploadFile: uploadedFiles
    })

    await newEod.save();

    return newEod;
}