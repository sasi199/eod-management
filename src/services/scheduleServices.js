const ScheduleModel = require("../models/sheduleModel");
const BatchModel = require("../models/batchModel");
const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');
const StaffModel = require("../models/staffModel");
const TimetableModel = require("../models/timetableModel");
const moment = require('moment');




exports.createSchedule = async (req) => {
    const { batch, days, trainers, timings } = req.body;

    const existBatch = await BatchModel.findById(batch);
    if (!existBatch) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "Batch not found" });
    }

    if (!Array.isArray(days) || days.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "Days must be a non-empty array" });
    }

    const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    for (const day of days) {
        if (!validDays.includes(day)) {
            throw new ApiError(httpStatus.BAD_REQUEST, { message: `Invalid day: ${day}` });
        }
    }

    if (!Array.isArray(trainers) || trainers.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "Trainers must be a non-empty array" });
    }

    for (const trainer of trainers) {
        const trainerExists = await StaffModel.findOne({ _id: trainer, isTrainer: true });
        if (!trainerExists) {
            throw new ApiError(httpStatus.BAD_REQUEST, { message: `Trainer not found: ${trainer}` });
        }
    }

    if (!Array.isArray(timings) || timings.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "Timings must be a non-empty array" });
    }

    for (const timing of timings) {
        if (!timing.startTime || !timing.endTime || !timing.subject) {
            throw new ApiError(httpStatus.BAD_REQUEST, {
                message: "Each timing must include 'startTime', 'endTime', and 'subject'.",
            });
        }
    }


    for (const day of days) {
        for (const trainer of trainers) {
            for (const timing of timings) {
                const conflict = await ScheduleModel.findOne({
                    batch,
                    days: day,
                    trainers: trainer,
                    'timings.startTime': { $lte: timing.endTime },
                    'timings.endTime': { $gte: timing.startTime },
                });

                if (conflict) {
                    throw new ApiError(httpStatus.CONFLICT, {
                        message: `Conflict detected: Trainer ${trainer} already has a schedule on ${day} from ${timing.startTime} to ${timing.endTime}.`,
                    });
                }
            }
        }
    };   
    
    const newSchedule = await ScheduleModel.create({
        batch,
        days,
        trainers,
        timings,
    });

    return newSchedule;

};



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