const TaskModel = require("../models/taskModel");
const httpStatus = require('http-status');
const ApiError = require("../utils/apiError");
const ProjectModel = require("../models/projectModel");
const NotificationModel = require("../models/notificationModel");
const Auth = require("../models/authModel");
const StaffModel = require("../models/staffModel");
const { formatDistanceToNow } = require('date-fns');




exports.createTask = async(req)=>{
    const { title, description, assignees,projectId, dueDate, priority} = req.body;

    const project = await ProjectModel.findById(projectId)
    console.log("vfdsesfg",project);
    
    if (!project) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: 'Project not found'}); 
    }

    const assigneeId = await StaffModel.findById(assignees);
        console.log(assigneeId,"asssaaa");
        
        if (!assigneeId) {
            throw new ApiError(httpStatus.BAD_REQUEST,{message: 'Assignee not found'});
        }

    const newTask = new TaskModel({
        ...req.body,
        projectId: project._id,
        assignees: assigneeId._id
    })

    await newTask.save();

        const notification = new NotificationModel({
            title: "Alert",
            content: `You have been assigned a new task: ${title}`,
            recipientId: assigneeId._id,
            status: "Unread",
        });

        await notification.save();

        const socketId = req.io.connectedUsers;
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
    const task = await TaskModel.find({}).populate({
        path:'assignees',
        select:'fullName profilePic role'
    });
    if (!task) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Trainer not found"});
    }
    return task;
}

exports.getTaskId = async(req)=>{
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

exports.editTask = async(req)=>{
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

    task.activities.push(...activities);

    Object.assign(task, updateData);

    await task.save();

    req.io.emit("dashboardUpdate", { message: "Task updated", task });

    return task;

}

exports.deleteTask = async(req)=>{
    const {_id } = req.params

    const task = await TaskModel.findById(_id);
    if(!task){
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Task not found"});
    }

    await TaskModel.findByIdAndDelete(_id);
    req.io.emit("dashboardUpdate", { message: "Task deleted", taskId });

}