const assessmentService = require("../services/assessmentService");
const catchAsync = require("../utils/catchAsync");



exports.createAssessment = catchAsync(async(req,res)=>{
    const response = await assessmentService.createAssessment(req)
    res.status(200).json({status:true, message:'Assessment created succesfully',data:response,})
})

exports.getAssessmentAll = catchAsync(async(req,res)=>{
    const response = await assessmentService.getAssessmentAll(req)
    res.status(200).json({status:true, message:'Assessments get succesfully',data:response,})
})

exports.getAssessmentId = catchAsync(async(req,res)=>{
    const response = await assessmentService.getAssessmentId(req)
    res.status(200).json({status:true, message:'Assessment get succesfully',data:response,})
})

exports.editAssessment = catchAsync(async(req,res)=>{
    const response = await assessmentService.editAssessment(req)
    res.status(200).json({status:true, message:'Assessment updated succesfully',data:response,})
})

exports.deleteAssessment = catchAsync(async(req,res)=>{
    const response = await assessmentService.deleteAssessment(req)
    res.status(200).json({status:true, message:'Assessment deleted succesfully',data:response,})
})

