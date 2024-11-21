const ScheduleModel = require("../models/sheduleModel");
const BatchModel = require("../models/batchModel");
const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');



exports.createSchedule = async(req)=>{
    const { batch, trainer,} = req.body

    const batches = await BatchModel.findOne({batchName:batch});
    
    if (!batches) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "batch not found"});
    }

    const newSchedule = new ScheduleModel({
        ...req.body
    })

    await newSchedule.save();

    return newSchedule;

}