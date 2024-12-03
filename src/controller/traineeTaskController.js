const traineeTaskServices = require("../services/traineeTaskServices");
const catchAsync = require("../utils/catchAsync");



exports.createTraineeTask = catchAsync(async(req,res)=>{
    const response = await traineeTaskServices.createTraineeTask(req);
    res.status(200).json({status:true, message:"Task created succesfully", data: response})
})

exports.getTraineeTaskAll = catchAsync(async(req,res)=>{
    const response = await traineeTaskServices.getTraineeTaskAll(req);
    res.status(200).json({status:true, message:"Task get succesfully", data: response})
})

exports.getTraineeTaskId = catchAsync(async(req,res)=>{
    const response = await traineeTaskServices.getTraineeTaskId(req);
    res.status(200).json({status:true, message:"Task get succesfully", data: response})
})

exports.editTraineeTask = catchAsync(async(req,res)=>{
    const response = await traineeTaskServices.editTraineeTask(req);
    res.status(200).json({status:true, message:"Task updated succesfully", data: response})
})

exports.deleteTraineeTask = catchAsync(async(req,res)=>{
    const response = await traineeTaskServices.deleteTraineeTask(req);
    res.status(200).json({status:true, message:"Task deleted succesfully", data: response})
})

exports.updateTraineeStatus = catchAsync(async(req,res)=>{
    const response = await traineeTaskServices.updateTraineeStatus(req);
    res.status(200).json({status:true, message:"Status updated succesfully", data: response})
})