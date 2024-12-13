const reportServices = require("../services/reportServices");
const catchAsync = require("../utils/catchAsync");



exports.createReport = catchAsync(async(req,res)=>{
    const response = await reportServices.createReport(req);
    res.status(200).json({status: true, message: "Report created successfully", data: response})
})

exports.getReportAll = catchAsync(async(req,res)=>{
    const response = await reportServices.getReportAll(req);
    res.status(200).json({status: true, message: "Reports get successfully", data: response})
})

exports.getReportId = catchAsync(async(req,res)=>{
    const response = await reportServices.getReportId(req);
    res.status(200).json({status: true, message: "Report get successfully", data: response})
})

exports.editReport = catchAsync(async(req,res)=>{
    const response = await reportServices.editReport(req);
    res.status(200).json({status: true, message: "Report updated successfully", data: response})
})

exports.deleteReport = catchAsync(async(req,res)=>{
    const response = await reportServices.deleteReport(req);
    res.status(200).json({status: true, message: "Report deleted successfully", data: response})
})


exports.replayReport = catchAsync(async(req,res)=>{
    const response = await reportServices.replayReport(req);
    res.status(200).json({status: true, message: "Replay to user successfully", data: response})
})


