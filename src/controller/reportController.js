const reportServices = require("../services/reportServices");
const catchAsync = require("../utils/catchAsync");



exports.createReport = catchAsync(async(req,res)=>{
    const response = await reportServices.createReport(req);
    res.status(200).json({status: true, message: "Report created successfully", data: response})
})