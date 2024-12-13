const scheduleServices = require("../services/scheduleServices");
const catchAsync = require("../utils/catchAsync");



exports.createSchedule = catchAsync(async(req,res)=>{
    const response = await scheduleServices.createSchedule(req);
    res.status(200).json({status:true, message: "Schedule created succssfully",data: response})
})

exports.getScheduleAll = catchAsync(async(req,res)=>{
    const response = await scheduleServices.getScheduleAll(req);
    res.status(200).json({status:true, message: "Schedules get succssfully",data: response})
})

exports.getScheduleId = catchAsync(async(req,res)=>{
    const response = await scheduleServices.getScheduleId(req);
    res.status(200).json({status:true, message: "Schedule get succssfully",data: response})
})

exports.editSchedule = catchAsync(async(req,res)=>{
    const response = await scheduleServices.editSchedule(req);
    res.status(200).json({status:true, message: "Schedule updated succssfully",data: response})
})

exports.deleteSchedule = catchAsync(async(req,res)=>{
    const response = await scheduleServices.deleteSchedule(req);
    res.status(200).json({status:true, message: "Schedule deleted succssfully",data: response})
})