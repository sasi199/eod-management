const TaskModel = require("../models/taskModel");
const httpStatus = require('http-status');
const ApiError = require("../utils/apiError");



exports.createTask = async(req)=>{
    const { title,assignees } = req.body;

    if (!title) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: 'Trainee already exist'}); 
    }

    assignees.forEach((assignee) => {
        if (!assignee.userId) {
            throw new ApiError(httpStatus.BAD_REQUEST,{message: 'Each assignee must have userId'});
        }
    });

    const newTask = new TaskModel({
        ...req.body
    })

    await newTask.save();
    return newTask;

}

exports.getTaskAll = async(req)=>{
    const task = await TaskModel.find(req);
    if (!task) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Trainer not found"});
    }
    return task;
}

exports.getTaskId = async(req)=>{
    const { taskId } = req.params;
    if (!taskId) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Trainer Id required"});
    }

    const task = await TaskModel.findById(taskId);
    if (!task) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Task not found"});
    }

    return task;
}