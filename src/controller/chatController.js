const chatServices = require("../services/chatServices");
const catchAsync = require("../utils/catchAsync");



exports.createChat = catchAsync(async(req,res)=>{
    const response = await chatServices.createChat(req)
    res.status(200).json({status:true, message:'chat created succesfully',data:response,})
})

exports.sendMessage = catchAsync(async(req,res)=>{
    const response = await chatServices.sendMessage(req)
    res.status(200).json({status:true, message:'Message send succesfully',data:response,})
})

exports.editMessage = catchAsync(async(req,res)=>{
    const response = await chatServices.editMessage(req)
    res.status(200).json({status:true, message:'Message edit succesfully',data:response,})
})

exports.deleteMessage = catchAsync(async(req,res)=>{
    const response = await chatServices.deleteMessage(req)
    res.status(200).json({status:true, message:'Message delete succesfully',data:response,})
})