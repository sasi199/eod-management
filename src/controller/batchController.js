const batchServices = require("../services/batchServices");
const catchAsync = require("../utils/catchAsync");



exports.createBatch = catchAsync(async(req,res)=>{
    const response = await batchServices.createBatch(req);
    res.status(200).json({status:true, message:'Batch created succesfully',data:response,})
})