const taskServices = require("../services/taskServices");
const catchAsync = require("../utils/catchAsync");



exports.createTask = catchAsync(async(req,res)=>{
    const response = await taskServices.createTask(req);
    res.status(200).json({status:true, message:"Task created succesfully", data: response})
})

exports.getTaskAll = catchAsync(async(req,res)=>{
    const response = await taskServices.getTaskAll(req);
    res.status(200).json({status:true, message:"Task get succesfully", data: response})
})