const staffServices = require("../services/staffServices");
const catchAsync = require("../utils/catchAsync");



exports.createStaff = catchAsync (async(req,res)=>{
    const response = await staffServices.createStaff(req)
    res.status(200).json({status:true, message:'Staff created succesfully',data:response,})
})