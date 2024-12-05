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

exports.getEodAll = async () => {
    const eods = await EodModel.find().populate("userName").populate("project");
    return eods;
};


exports.getEodById = async (id) => {
    const eod = await EodModel.findById(id).populate("userName").populate("project");
    if (!eod) {
        throw new ApiError(httpStatus.NOT_FOUND, { message: "EOD not found" });
    }
    return eod;
};


exports.editEod = async(req)=>{
    const { project, department,description, links} = req.body
    const { accountId } = req;
    const { _id } = req.params;

    const eod = await EodModel.findById(id);
    if (!eod) {
        throw new ApiError(httpStatus.NOT_FOUND, { message: "EOD not found" });
    }

    if (project) {
        const projects = await ProjectModel.findOne({ projectName: project });
        if (!projects) {
            throw new ApiError(httpStatus.BAD_REQUEST, { message: "Project not found" });
        }
        eod.project = project;
    }

    if (req.files && req.files.uploadFile && req.files.uploadFile.length > 0) {
        const uploadPromises = req.files.uploadFile.map(async (file) => {
            const fileExtension = file.originalname.split(".").pop();
            const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExtension}`;
            return await uploadCloud(`Eod/${fileName}`, file);
        });

        const uploadFiles = await Promise.all(uploadPromises);
        eod.uploadFile.push(...uploadFiles);
    }

    if (department) eod.department = department;
    if (description) eod.description = description;
    if (links) {
        eod.link = Array.isArray(links) ? links : JSON.parse(links);
    }

    await eod.save();
    return eod;
}



exports.deleteEod = async () => {
    const {_id} = req.params;
    const eod = await EodModel.findByIdAndDelete(_id);
    if (!eod) {
        throw new ApiError(httpStatus.NOT_FOUND, { message: "EOD not found" });
    }
    return { message: "EOD deleted successfully" };
};
