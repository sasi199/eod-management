const TrainerService = require('../services/trainerService');
const catchAsync = require('../utils/catchAsync');



exports.createTrainer = catchAsync (async(req,res)=>{
    const response = await TrainerService.createTrainer(req)
    res.status(200).json({status:true, message:'Trainer created succesfully',data:response,})
})


exports.getTrainerAll = catchAsync (async(req,res)=>{
    const response = await TrainerService.getTrainerAll(req)
    res.status(200).json({status:true, message:'Trainers get succesfully',data:response,})
})


exports.getTrainerById = catchAsync (async(req,res)=>{
    const response = await TrainerService.getTrainerById(req)
    res.status(200).json({status:true, message:'Trainer get succesfully',data:response,})
})

exports.editTrainer = catchAsync (async(req,res)=>{
    const response = await TrainerService.editTrainer(req)
    res.status(200).json({status:true, message:'Trainer updated succesfully',data:response,})
})

exports.deleteTrainer = catchAsync (async(req,res)=>{
    const response = await TrainerService.deleteTrainer(req)
    res.status(200).json({status:true, message:'Trainer delete succesfully',data:response,})
})