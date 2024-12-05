const ProjectModel = require("../models/projectModel");
const TaskModel = require("../models/taskModel");
const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');
const StaffModel = require('../models/staffModel');



exports.createProject = async(req)=>{
    const { projectName,department } = req.body;

    const project  = await ProjectModel.findOne({projectName})
    if (project) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "project already exist"});
    }

    const newProject = new ProjectModel({
        ...req.body
    })

    await newProject.save();
    return newProject
}

exports.getProjectAll = async(req)=>{
    const project = await ProjectModel.find({})
    if (!project) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Batch not found"});
    }

    return project;
}

exports.getProject = async(req)=>{
    const { department } = req.body
    const project = await ProjectModel.find({department:department})
    if (!project) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Project not found"});
    }

    return project;
}

exports.getProjectId = async(req)=>{
    const { accountId } = req

    //project only get user department
    const user = await StaffModel.findOne({accountId});
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, { message: "User not found" });
    }

    const userDepartment = user.department;

    const project = await ProjectModel.find({ department: userDepartment });
    return project;
}

exports.editProject = async(req)=>{
    const { _id } = req.params
    
    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Project id required"});
    }

    const project = await ProjectModel.findById(_id)
    if (!project) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "project not found"});
    }

    const updateData = {...req.body}

    const updateTask = await ProjectModel.findByIdAndUpdate(_id,updateData,
        {new: true, runValidators: true}
    )

    return updateTask;
}

exports.deleteProject = async(req)=>{
    const { _id } = req.params
    
    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Batch id required"});
    }

    const project = await ProjectModel.findById(_id)
    if (!project) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Batch not found"});
    }

    await ProjectModel.findByIdAndDelete(_id)
}


exports.getTaskByProject = async(req)=>{
    const { _id } = req.params;
    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "Project ID is required" });
    }

    const task  = await TaskModel.find({projectId:_id}).populate({
        path:'assignees',
        select:'fullName profilePic role'
    });
    console.log(task,"kskshjhs");
    
    if (!task) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "task not found" });
    }
    return task;
}