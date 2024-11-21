const assessmentService = require("../services/assessmentService");
const catchAsync = require("../utils/catchAsync");



exports.createAssessment = catchAsync(async(req,res)=>{
    const response = await assessmentService.createAssessment(req)
    res.status(200).json({status:true, message:'Assessment created succesfully',data:response,})
})