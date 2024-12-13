const batchServices = require("../services/batchServices");
const catchAsync = require("../utils/catchAsync");



exports.createBatch = catchAsync(async(req,res)=>{
    const response = await batchServices.createBatch(req);
    res.status(200).json({status:true, message:'Batch created succesfully',data:response,})
})

exports.getBatchAll = catchAsync(async(req,res)=>{
    const response = await batchServices.getBatchAll(req)
    res.status(200).json({status:true, message:'Batchs get succesfully',data:response,})
})

exports.getBatchId = catchAsync(async(req,res)=>{
    const response = await batchServices.getBatchId(req)
    res.status(200).json({status:true, message:'Batch get succesfully',data:response,})
})

exports.editBatch = catchAsync(async(req,res)=>{
    const response = await batchServices.editBatch(req)
    res.status(200).json({status:true, message:'Batch updated succesfully',data:response,})
})

exports.deleteBatch = catchAsync(async(req,res)=>{
    const response = await batchServices.deleteBatch(req)
    res.status(200).json({status:true, message:'Batch edited succesfully',data:response,})
})

exports.batchCount = catchAsync(async(req,res)=>{
    const response = await batchServices.batchCount(req)
    res.status(200).json({status:true, message:'Batch count get succesfully',data:response,})
})