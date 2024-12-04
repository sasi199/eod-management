const Auth = require("../models/authModel");
const EodModel = require("../models/eod");
const ProjectModel = require("../models/projectModel");
const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');
const uploadCloud = require("../utils/uploadCloud");


exports.createEod = async(req)=>{
    const { project, department,description, links} = req.body
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
    if (req.files.uploadFile && req.files.uploadFile && req.files.uploadFile.length > 0) {

        const uploadPromises = req.files.uploadFile.map(async(file)=>{
            const fileExtension = file.originalname.split('.').pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExtension}`;
           return await uploadCloud(`Eod/${fileName}`, file);
        });

        const uploadFiles = await Promise.all(uploadPromises);
        uploadFile.push(...uploadFiles);
         if (uploadFile.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "No files uploaded" });
    }
    }

    let linkArray = [];
    if(links){
      
        linkArray = Array.isArray(links) ? links : JSON.parse(links);
        if (linkArray.length === 0) {
            throw new ApiError(httpStatus.BAD_REQUEST, { message: "No links uploaded" });
        }
      }



    const newEod = new EodModel({
        project,
        userName: user,
        department,
        uploadFile,
        description,
        link:linkArray
    })

    await newEod.save();

    return newEod;
}