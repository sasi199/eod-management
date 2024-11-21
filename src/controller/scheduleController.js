const scheduleServices = require("../services/scheduleServices");
const catchAsync = require("../utils/catchAsync");



exports.createSchedule = catchAsync(async(req,res)=>{
    const response = await scheduleServices.createSchedule(req);
    res.status(200).json({status:true, message: "Schedule created succssfully",data: response})
})