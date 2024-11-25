const TaskModel = require("../models/taskModel");
const httpStatus = require('http-status');
const ApiError = require("../utils/apiError");
const ProjectModel = require("../models/projectModel");
const NotificationModel = require("../models/notificationModel");
const Auth = require("../models/authModel");



exports.createTask = async(req)=>{
    const { title, description, assignees,projectId, dueDate, priority} = req.body;

    const project = await ProjectModel.findById(projectId)
    console.log("vfdsesfg",project);
    
    if (!project) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: 'Project not found'}); 
    }

    const newTask = new TaskModel({
        ...req.body,
        projectId: project._id
    })

    await newTask.save();

        const assigneeId = await Auth.findOne({accountId:assignees})
        if (!assigneeId) {
            console.error(`Assignee with accountId not found.`);
        }
        const notification = new NotificationModel({
            title: "Alert",
            content: `You have been assigned a new task: ${title}`,
            recipientId: assigneeId.accountId,
            status: "Unread",
        });

        await notification.save();

        const socketId = req.io.connectedUsers[assignees];
        if (socketId) {
            req.io.to(socketId).emit("taskNotification", {
                taskId: newTask._id,
                title: notification.title,
                content: notification.content,
                status: notification.status,
                createdAt: notification.createdAt,
            });
        }
    

    req.io.emit("dashboardUpdate", { message: "Task created", task: newTask });

    return newTask;

}

exports.getTaskAll = async(req)=>{
    const task = await TaskModel.find({});
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
    if (!taskId) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Task Id required"});
    }

    const updateData = {...req.body}
    const task = await TaskModel.findById(taskId)
    if (!task) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Task not found"});
    }

    const updateTask = await TaskModel(taskId,updateData,
        { new:true,runValidators:true }
    )

    await updateTask.save();
    req.io.emit("dashboardUpdate", { message: "Task updated", task: updateTask });

    return updateTask;

}

exports.deleteTask = async(req)=>{
    const { taskId } = req.params

    const task = await TaskModel.findById(taskId);
    if(!task){
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Task not found"});
    }

    await TaskModel.findByIdAndDelete();
    req.io.emit("dashboardUpdate", { message: "Task deleted", taskId });

}