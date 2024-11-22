const TaskModel = require("../models/taskModel");
const httpStatus = require('http-status');
const ApiError = require("../utils/apiError");
const ProjectModel = require("../models/projectModel");



exports.createTask = async(req)=>{
    const { title, description, assignees, dueDate, priority} = req.body;
    const { projectId }  = req.params;

    const project = await ProjectModel.findOne(projectId)
    console.log("vfdsesfg",project);
    
    
    if (!project) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: 'Project not found'}); 
    }

    assignees.forEach((assignee) => {
        if (!assignee.userId) {
            throw new ApiError(httpStatus.BAD_REQUEST,{message: 'Each assignee must have userId'});
        }
    });

    const newTask = new TaskModel({
        ...req.body,
        projectId: project
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

exports.editTask = async(req)=>{
    const { taskId } = req.params;
    if (taskId) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Task Id required"});
    }

    const updateData = req.body
    const task = await TaskModel.findById(taskId)
    if (!task) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Task not found"});
    }

    const updateTask = await TaskModel(taskId,updateData,
        { new:true,runValidators:true }
    )

    await updateTask.save();

    return updateTask;

}

exports.deleteTask = async(req)=>{
    const { taskId } = req.params

    const task = await TaskModel.findById(taskId);
    if(!task){
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Task not found"});
    }

    await TaskModel.findByIdAndDelete();
}