const ScheduleModel = require("../models/sheduleModel");
const BatchModel = require("../models/batchModel");
const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');
const StaffModel = require("../models/staffModel");
const TimetableModel = require("../models/timetableModel");




exports.createSchedule = async (req) => {
    const { batch,date,timeTable } = req.body;

    const existBatch = await BatchModel.findById(batch);
    if (!existBatch) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "Batch not found" });
    }

    const existingSchedule = await ScheduleModel.findOne({ batch, date });
    if (existingSchedule) {
        throw new ApiError(httpStatus.BAD_REQUEST, {
            message: `A schedule already exists for this batch on Today ${date}.`,
        });
    }

    for (const entry of timeTable) {
        const { trainer, startTime, endTime } = entry;

        const conflict = await TimetableModel.findOne({
            trainer,
            date,
            $or: [
                { startTime: { $lte: endTime }, endTime: { $gte: startTime }},
            ],
        });

        if (conflict) {
            throw new ApiError(httpStatus.BAD_REQUEST, { 
                message: `Trainer ${trainer} is already assigned to another batch during the specified time.` 
            });
        }
    }

    const newSchedule = new ScheduleModel({
        batch,
        date,
    });

    await newSchedule.save();

    const timeTableEntries = timeTable.map(entry => ({
        ...entry,
        scheduleId: newSchedule._id,
    }));

    const createdTimeTables = await TimetableModel.insertMany(timeTableEntries);
    newSchedule.timeTable = createdTimeTables.map(entry => entry._id);
    await newSchedule.save();

    return newSchedule;

};



exports.getScheduleAll = async(req)=>{
    const schedule = await ScheduleModel.aggregate([
        {
            $lookup:{
                from: "TimeTable",
                localField: "_id",
                foreignField: "scheduleId",
                as: "details",
            },
        },
            {
                
                $project: {
                    _id: 1,
                    batch: 1,
                    date: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    "details.trainer": 1,
                    "details.startTime": 1,
                    "details.endTime": 1,
                    "details.subject": 1,
                    "details.status": 1,
                },
        }
    ])
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

    const schedule = await ScheduleModel.findById(_id).populate({
        path:'timeTable',
        populate:{
            path:'trainer',
            select:'fullName profilePic'
        }
    });
    if (!schedule) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Schedule  not  found"});
    }

    return schedule;

}


exports.editSchedule = async(req)=>{
    const { _id } = req.params;

    if(!_id){
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Schedule  id required"});
    }

    const schedule = await ScheduleModel.findById(_id)
    if (!schedule) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Schedule  not  found"});
    }

    const updateData = {...req.body};
    const updateSchedule = await ScheduleModel.findByIdAndUpdate(_id,updateData,
        {new:true,runValidators:true});

    const updateTimetable = await TimetableModel.findByIdAndUpdate({scheduleId:_id},updateData,
        {new:true,runValidators:true})

    await updateSchedule.save();
    await updateTimetable.save();
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