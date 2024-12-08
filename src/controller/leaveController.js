const leaveService = require("../services/leaveService");
const catchAsync = require("../utils/catchAsync");



exports.applyLeaveRequset = catchAsync(async(req,res)=>{
    const response = await leaveService.applyLeaveRequset(req);
    res.status(200).json({status:true, message:'Leave request submitted successfully',data:response,})
});

exports.approveLeave = catchAsync(async(req,res)=>{
    const response = await leaveService.approveLeave(req);
    res.status(200).json({status:true, message:'Leave approved successfully',data:response,})
});