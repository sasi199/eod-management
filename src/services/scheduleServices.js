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

    const existingSchedule = await ScheduleModel.findOne({
        batch,
        date,
        classTimings,
        trainer
      });

      if (existingSchedule) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: `A schedule already exists for batch "${batchExists.name}" on ${date} at ${classTimings}`});
      }

    const newSchedule = new ScheduleModel({
        ...req.body,
        batch:batches._id
    })

    await newSchedule.save();

    return newSchedule;

}


exports.getScheduleAll = async(req)=>{
    const schedule = await ScheduleModel.find({})
    if (!schedule) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Schedule not found"});
    }

    return schedule;
}

exports.getScheduleId = async(req)=>{
    const { _id } = req.params;

    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Schedule  id required"});
    }

    const schedule = await ScheduleModel.findById(_id);
    if (!schedule) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Schedule  not  found"});
    }

    return schedule;

}


exports.editSchedule = async(req)=>{
    const { _id } = req.params;

    if(_id){
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Schedule  id required"});
    }

    const schedule = await ScheduleModel.findById(_id)
    if (!schedule) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Schedule  not  found"});
    }

    const updateData = {...req.body};
    const updateSchedule = await ScheduleModel.findByIdAndUpdate(_id,updateData,
        {new:true,runValidators:true})

    await updateSchedule.save();
    return updateSchedule;

}


exports.deleteSchedule = async(req)=>{
    const { _id } = req.params;
    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Schedule  id required"});
    }

    const schedule = await ScheduleModel.findById(_id);
    if (!schedule) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Schedule  not  found"});
    }

    await ScheduleModel.findByIdAndDelete(_id);
}