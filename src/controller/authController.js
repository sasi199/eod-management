const catchAsync = require("../utils/catchAsync");
const authService = require("../services/authServices");
const { getAuthToken } = require("../middlewares/jwt.config");



exports.authLogin = catchAsync (async(req,res)=>{
    const response = await authService.loginByEmailAndLogId(req)
    let authToken = null;

    if (response) {
        authToken = await getAuthToken(response)
    }

    res.status(200).json({status:true, message: "Login successfully", data:response, authToken})
})


exports.createAttendance = catchAsync(async(req,res)=>{
    const response = await authService.createAttendance(req)
    res.status(200).json({status:true, message: "Attendance craete successfully",data:response})
})

exports.getAttendance = catchAsync(async(req,res)=>{
    const response = await authService.getAttendance(req)
    res.status(200).json({status:true, message: "Attendance get successfully",data:response})
})

exports.getTraineeAttendance = catchAsync(async(req,res)=>{
    const response = await authService.getTraineeAttendance(req)
    res.status(200).json({status:true, message: "Trainee attendance get successfully",data:response})
})

exports.editTraineeAttendance = catchAsync(async(req,res)=>{
    const response = await authService.editTraineeAttendance(req)
    res.status(200).json({status:true, message: "Trainee attendance updated successfully",data:response})
})



exports.logoutUser = catchAsync(async(req,res)=>{
    const response = await authService.logoutUser(req)
    res.status(200).json({status:true, message: "User logout successfully",data:response})
})


exports.authCreation = catchAsync(async(req,res)=>{
    const response = await authService.authCreation(req);
    res.status(200).json({status:true, message: "Auth created successfully",data:response})
})