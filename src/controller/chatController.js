const chatServices = require("../services/chatServices");
const catchAsync = require("../utils/catchAsync");



exports.createChat = catchAsync(async(req,res)=>{
    const response = await chatServices.createChat(req)
    res.status(200).json({status:true, message:'Batch created succesfully',data:response,})
})