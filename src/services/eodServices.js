const Auth = require("../models/authModel");
const EodModel = require("../models/eod");
const ProjectModel = require("../models/projectModel");
const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');
const uploadCloud = require("../utils/uploadCloud");


exports.createEod = async(req)=>{
    const { project, department,descryption} = req.body
    const { accountId } = req

    const projects = await ProjectModel.findOne({projectName:project});
    if (!projects) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Project not found"});
    }

    const user = await Auth.findOne({accountId});
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "User not found"});
    }

    let uploadFile =[]
    if (req.files && req.files.files && req.files.files.length > 0) {
        for(const file of req.files.files){
            console.log(`Uploading file: ${file.originalname}`);
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExtension}`;
            const uploadedFileUrl = await uploadCloud(`Eod/${fileName}`, file);
            uploadFile.push(uploadedFileUrl);
            console.log(`Uploaded URL: ${uploadedFileUrl}`);
        }
    }
    
    if (uploadFile.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "No files uploaded" });
    }

    const newEod = new EodModel({
        project,
        userName: user,
        department,
        uploadFile,
        descryption
    })

    await newEod.save();

    return newEod;
}