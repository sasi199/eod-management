const ScheduleModel = require("../models/sheduleModel");
const BatchModel = require("../models/batchModel");
const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');



exports.createSchedule = async(req)=>{
    const { batch, trainer, timeTable } = req.body

    const existBatch = await BatchModel.findById(batch);
    if (!existBatch) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "Batch not found" });
    } 

    const existTrainer = await StaffModel.findById({ _id: trainer, isTrainer: true });
    if (!existTrainer) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "Trainer not found" });
    }

    for (let day = startOfWeek; day.isSameOrBefore(endOfWeek); day.add(1, "days")) {
        for (const slot of timeTable) {
            
            const conflict = await TimetableModel.findOne({
                trainer,
                date: day.toDate(),
                startTime: { $lte: slot.endTime },
                endTime: { $gte: slot.startTime },
            });

            if (conflict) {
                throw new ApiError(httpStatus.CONFLICT, {
                    message: `Trainer is already assigned during ${slot.startTime} - ${slot.endTime} on ${day.format("YYYY-MM-DD")}`,
                });
            }

            
            const newTimetable = await TimetableModel.create({
                ...slot,
                trainer,
                batch,
                date: day.toDate(),
            });

            schedules.push(
                await ScheduleModel.findOneAndUpdate(
                    { batch, date: day.toDate() },
                    { $push: { timeTable: newTimetable._id } },
                    { upsert: true, new: true }
                )
            );
        }
    }

    return schedules;
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