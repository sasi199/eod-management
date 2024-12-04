const projectServices = require("../services/projectServices");
const catchAsync = require("../utils/catchAsync");



exports.createProject = catchAsync(async(req,res)=>{
    const response = await projectServices.createProject(req);
    res.status(200).json({status:true, message:'project created succesfully',data:response,})
});

exports.getProjectAll = catchAsync(async(req,res)=>{
    const response = await projectServices.getProjectAll({});
    res.status(200).json({status:true, message:'projects get succesfully',data:response,})
})

exports.getProject = catchAsync(async(req,res)=>{
    const response = await projectServices.getProject(req);
    res.status(200).json({status:true, message:'projects get succesfully',data:response,})
})

exports.getProjectId = catchAsync(async(req,res)=>{
    const response = await projectServices.getProjectId(req);
    res.status(200).json({status:true, message:'project get succesfully',data:response,})
})

exports.editProject = catchAsync(async(req,res)=>{
    const response = await projectServices.editProject(req);
    res.status(200).json({status:true, message:'project updated succesfully',data:response,})
})

exports.deleteProject = catchAsync(async(req,res)=>{
    const response = await projectServices.deleteProject(req);
    res.status(200).json({status:true, message:'project deleted succesfully',data:response,})
})

exports.getTaskByProject = catchAsync(async(req,res)=>{
    const response = await projectServices.getTaskByProject(req);
    res.status(200).json({status:true, message:'projectByTask get succesfully',data:response,})
})