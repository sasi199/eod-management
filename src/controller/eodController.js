const eodServices = require("../services/eodServices");
const catchAsync = require("../utils/catchAsync");



exports.createEod = catchAsync(async(req,res)=>{
    const response = await eodServices.createEod(req);
    res.status(200).json({status:true, message:'Eod created succesfully',data:response,})
});