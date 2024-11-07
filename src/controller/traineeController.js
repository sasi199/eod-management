const traineeService = require('../services/traineeService');
const catchAsync = require('../utils/catchAsync');



exports.createTrainee = catchAsync(async(req,res)=>{
    const response = await traineeService.createTrainee(req)
    res.status(200).json({status:true, message:'Trainee created succesfully',data:response,})
})

exports.getTraineeAll = catchAsync(async(req,res)=>{
    const response = await traineeService.getTraineeAll(req)
    res.status(200).json({status:true, message:'Trainees get succesfully',data:response,})
})

exports.getTraineeId = catchAsync(async(req,res)=>{
    const response = await traineeService.getTraineeId(req)
    res.status(200).json({status:true, message:'Trainee get succesfully',data:response,})
})

exports.editTrainee = catchAsync(async(req,res)=>{
    const response = await traineeService.editTrainee(req)
    res.status(200).json({status:true, message:'Trainee updated succesfully',data:response,})
})

exports.deleteTrainee = catchAsync(async(req,res)=>{
    const response = await traineeService.deleteTrainee(req)
    res.status(200).json({status:true, message:'Trainee deleted succesfully',data:response,})
})