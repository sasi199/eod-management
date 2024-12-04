const TraineeTaskModel = require("../models/TraineeTaskModel");
const StudentProgressModel = require("../models/studentProgressModel");
const BatchModel = require("../models/batchModel");
const httpStatus = require('http-status');
const ApiError = require("../utils/apiError");
const NotificationModel = require("../models/notificationModel");
const Auth = require("../models/authModel");
const StaffModel = require("../models/staffModel");
const { formatDistanceToNow } = require('date-fns');
const {AssignedBatchModel} = require("../models/assignedBatchesModel");
const TraineeModel = require("../models/traineeModel");




exports.createTraineeTask = async(req)=>{
    const { title, description, dueDate, priority, batchId} = req.body;
    const { accountId } = req;
    console.log(accountId,"ajajakaakakaal");
    

    const traineeData = await AssignedBatchModel.find({batchId, trainee:{$exists:true}}).populate('trainee'); 
    const trainerData = await AssignedBatchModel.find({batchId,trainer:accountId});
  
    if ( !trainerData) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: 'Batch not found for trainer'}); 
    }

    if (!traineeData || traineeData.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: 'No trainees found in the batch' });
    }


    const newTask = await TraineeTaskModel.create({
        title,
        description,
        dueDate,
        trainerId:accountId,
        batchId
    });


    const progressEntries = traineeData
    .filter((data) => data.trainee)
    .map((data) => ({
        taskId: newTask._id,
        traineeId: data.trainee._id,
        status: 'not attended',
    }));

await StudentProgressModel.insertMany(progressEntries);

 
    const notifications = traineeData.map((doc) => ({
        title: "Alert",
        content: `You have been assigned a new task: ${title}`,
        recipientId: doc.trainee,
        status: "Unread",
    }));

    await NotificationModel.insertMany(notifications);
   
    traineeData.forEach((doc) => {
        const traineeId = doc.trainee;
        const socketId = req.io.connectedUsers ? req.io.connectedUsers[traineeId] : null
        if (socketId) {
            req.io.to(socketId).emit("taskNotification", {
                taskId: newTask._id,
                title: "Alert",
                content: `You have been assigned a new task: ${title}`,
                status: "Unread",
            });
        }
    });
    

    req.io.emit("dashboardUpdate", { message: "Task created", task: newTask });

    return newTask;

}

exports.getTraineeTaskAll = async (req) => {
    const tasks = await TraineeTaskModel.aggregate([
        {
            $lookup: {
                from: "Batch",
                localField: "batchId",
                foreignField: "_id",
                as: "batchDetails",
            },
        },
        {
            $lookup: {
                from: "StudentProgress",
                localField: "_id",
                foreignField: "taskId",
                as: "progressDetails",
            },
        },
        {
            $lookup: {
                from: "Trainee",
                localField: "progressDetails.traineeId",
                foreignField: "_id",
                as: "traineeDetails",
            },
        },

        {
            $project: {
                title: 1,
                description: 1,
                dueDate: 1,
                priority: 1,
                batchDetails:{
                    _id: 1,
                    batchName: 1,
                },
                progressDetails: 1,
                traineeDetails:{
                    _id: 1,
                    fullName: 1,
                    profilePic: 1,
                },
            },
        },
    ]);

    if (!tasks || tasks.length === 0) {
        throw new Error("No tasks found");
    }

    return tasks;
};


exports.getTraineeTaskId = async(req)=>{
    const { accountId } = req;
    if (!accountId) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"trainer id required"});
    }
    const task = await TraineeTaskModel.aggregate([
        {
            $match:{trainerId: accountId},
        },
        {
            $lookup:{
                from:'Batch',
                localField:'batchId',
                foreignField:'_id',
                as:'batchDetails'
            }
        },
        {
            $lookup: {
                from: "StudentProgress",
                localField: "_id",
                foreignField: "taskId",
                as: "progressDetails",
            },
        },
        {
            $lookup: {
                from: "Trainee",
                localField: "progressDetails.traineeId",
                foreignField: "_id",
                as: "traineeDetails",
            },
        },
        {
            $project: {
                title: 1,
                description: 1,
                dueDate: 1,
                priority: 1,
                batchDetails: {
                    _id: 1,
                    batchName: 1,
                },
                progressDetails: 1,
                traineeDetails: {
                    _id: 1,
                    fullName: 1,
                    profilePic: 1,
                },
            },
        },
    ]);

    if (!task || task.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, { message: "Task not found" });
    }

    return task;
}

exports.editTraineeTask = async(req)=>{
    const { _id } = req.params;
    if (!_id) {

        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Task Id required"});
    }

    const updateData = {...req.body}
    const task = await TraineeTaskModel.findById(_id)
    const progress = await StudentProgressModel.find({taskId:_id})
    console.log(task,'kakakakak');
    
    if (!task) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Task not found"});
    }

    const updatedTask = await TraineeTaskModel.findByIdAndUpdate(
        _id,
        { $set: updateData },
        { new: true }
    );
    
    const updateProgress = await StudentProgressModel.findOneAndUpdate({taskId:_id},
        { $set: updateData },
        { new: true }
    )
    await updatedTask.save();

    req.io.emit("dashboardUpdate", { message: "Task updated", task });

    return updatedTask;

}

exports.deleteTraineeTask = async(req)=>{
    const {_id } = req.params

    const task = await TaskModel.findById(_id);
    if(!task){
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Task not found"});
    }

    await TaskModel.findByIdAndDelete(_id);
    req.io.emit("dashboardUpdate", { message: "Task deleted", taskId });

}


exports.updateTraineeStatus = async(req, res) => {
    const { status } = req.body;
    const { _id } = req.params;
    const { accountId } = req
    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Task id not found"});
    }
    const trainee = await Auth.findOne({accountId:accountId})
    console.log(trainee,"ajajjaja");
    
    if (!trainee) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Auth id not found"});
    }
    
    const validStatuses = ['not attended', 'in progress', 'completed'];
    if (!validStatuses.includes(status)) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Invalid status not found"});
    }

    const progressEntry = await StudentProgressModel.findOne({
        taskId:_id,
        traineeId: trainee.accountId
    });

    console.log("progressss",progressEntry);
    

    if (!progressEntry) {
        throw new ApiError(httpStatus.NOT_FOUND, { message: "Progress entry not found for this trainee and task" });
    }

    progressEntry.status = status;
    await progressEntry.save();

    
    const task = await TraineeTaskModel.findById(_id);
    const notificationContent = `Trainee ${trainee} updated task status to ${status}`;
    
    const notification = new NotificationModel({
        title: "Alert",
        content: notificationContent,
        recipientId: task.trainerId,
        status: "Unread",
    });

    await notification.save();

    
    const socketId = req.io.connectedUsers ? req.io.connectedUsers[task.trainerId] : null;
    if (socketId) {
        req.io.to(socketId).emit("statusUpdateNotification", {
            taskId: _id,
            traineeId: trainee,
            status: status,
            message: notificationContent,
        });
    }
};


exports.getTraineeTask = async(req)=>{
    const { batch } = req
    if (!batch) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Batch id not found"});
    }
    const tasks = await TraineeTaskModel.find({batchId:batch}).populate({
        path:'trainerId',
        select:'fullName profilePic'
    });
    console.log("task",tasks);
    
    if (!tasks || tasks.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, { message: "No tasks found for the given batch ID" });
    }

    return tasks;
}