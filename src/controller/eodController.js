const eodServices = require("../services/eodServices");
const catchAsync = require("../utils/catchAsync");



exports.createEod = catchAsync(async(req,res)=>{
    const response = await eodServices.createEod(req);
    res.status(200).json({status:true, message:'Eod created succesfully',data:response,})
});

exports.getEodAll = catchAsync(async(req,res)=>{
    const response = await eodServices.getEodAll(req);
    res.status(200).json({status:true, message:'Eod get succesfully',data:response,})
});

exports.getEodById = catchAsync(async(req,res)=>{
    const response = await eodServices.getEodById(req);
    res.status(200).json({status:true, message:'Eod get  succesfully',data:response,})
});
exports.editEod = catchAsync(async(req,res)=>{
    const response = await eodServices.editEod(req);
    res.status(200).json({status:true, message:'Eod updated succesfully',data:response,})
});
exports.deleteEod = catchAsync(async(req,res)=>{
    const response = await eodServices.deleteEod(req);
    res.status(200).json({status:true, message:'Eod deleted succesfully',data:response,})
});