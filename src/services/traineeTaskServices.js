const TraineeTaskModel = require("../models/TraineeTaskModel");
const StudentProgressModel = require("../models/studentProgressModel");
const BatchModel = require("../models/batchModel");
const httpStatus = require('http-status');
const ApiError = require("../utils/apiError");
const NotificationModel = require("../models/notificationModel");
const Auth = require("../models/authModel");
const StaffModel = require("../models/staffModel");
const { formatDistanceToNow } = require('date-fns');
const AssignedBatchModel = require("../models/assignedBatchesModel");




exports.createTraineeTask = async(req)=>{
    const { title, description, dueDate, priority, trainerId, batchId} = req.body;

    const traineeData = await AssignedBatchModel.find({batchId, trainee:{$exists:true}}).populate('trainee'); 
    const trainerData = await AssignedBatchModel.findOne({batchId,trainer:trainerId});
  
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
        trainerId,
        batchId
    });


    const progressEntries = traineeData.map((data) => ({
        taskId: newTask._id,
        traineeId: data.trainee._id,
        status: 'not attended',
    }));
    await StudentProgressModel.insertMany(progressEntries);

 
    const notifications = traineeData.map((doc) => ({
        title: "Alert",
        content: `You have been assigned a new task: ${title}`,
        recipientId: doc.trainee._id,
        status: "Unread",
    }));
    await NotificationModel.insertMany(notifications);
console.log("trinnn",traineeData)
   
    traineeData.forEach((doc) => {
        const traineeId = doc.trainee._id;
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

exports.getTraineeTaskAll = async(req)=>{
    const task = await TraineeTaskModel.find({}).populate({
        path:'batchId',
        populate:{
            path: 'trainee',
            select: 'fullName profilepic'
        }
    });
    if (!task) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Trainer not found"});
    }

    if (!task || task.length === 0) {
        throw new ApiError(httpStatus.NOT_FOUND, { message: "No tasks found" });
    }

    // Step 2: Fetch progress for each task
    const taskIds = task.map(tasks => tasks._id); // Extract all task IDs
    const progressData = await StudentProgressModel.find({ taskId: { $in: taskIds } });
    return task;
}

exports.getTraineeTaskId = async(req)=>{
    const { _id } = req.params;
    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Task Id required"});
    }

    const task = await TaskModel.findById(_id).populate({
        path:'assignees',
        select:'fullName profilePic role'
    });
    if (!task) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Task not found"});
    }

    return task;
}

exports.editTraineeTask = async(req)=>{
    const { _id } = req.params;
    if (!_id) {

        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Task Id required"});
    }

    const updateData = {...req.body}
    const task = await TaskModel.findById(_id)
    console.log(task,'kakakakak');
    
    if (!task) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Task not found"});
    }

    const activities = [];
    const now = new Date();

    if (updateData.title && updateData.title !== task.title) {
        activities.push({
            type: 'updated',
            activity: `Title changed from ${task.title} to ${updateData.title}`,
            date: now,
            timeAgo: formatDistanceToNow(now, { addSuffix: true }),
        });
    }

    if (updateData.description && updateData.description !== task.description) {
        activities.push({
            type: 'updated',
            activity: `Description updated`,
            date: now,
            timeAgo: formatDistanceToNow(now, { addSuffix: true }),
        });
    }

    if (updateData.priority && updateData.priority !== task.priority) {
        activities.push({
            type: 'updated',
            activity: `Priority changed from ${task.priority} to ${updateData.priority}`,
            date: now,
            timeAgo: formatDistanceToNow(now, { addSuffix: true }),
        });
    }

    if (updateData.status && updateData.status !== task.status) {
        activities.push({
            type: 'updated',
            activity: `Status changed from ${task.status} to ${updateData.status}`,
            date: now,
            timeAgo: formatDistanceToNow(now, { addSuffix: true }),
        });
    }


    if (updateData.dueDate && updateData.dueDate !== task.dueDate.toISOString()) {
        activities.push({
            type: 'updated',
            activity: `Due date changed from ${task.dueDate.toISOString().split('T')[0]} to ${updateData.dueDate}`,
            date: now,
            timeAgo: formatDistanceToNow(now, { addSuffix: true }),
        });
    }

    // task.activities.push(...activities);

    // Object.assign(task, updateData);

    if (activities.length > 0) {
        await TaskModel.findByIdAndUpdate(
            _id,
            {
                $push: { activities: { $each: activities } },
            }
        );
    }
    
    const updatedTask = await TaskModel.findByIdAndUpdate(
        _id,
        { $set: updateData },
        { new: true }
    );
    

    await task.save();

    req.io.emit("dashboardUpdate", { message: "Task updated", task });

    return task;

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