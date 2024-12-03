const studentAttendanceService = require("../services/studentAttendanceService");
const catchAsync = require("../utils/catchAsync");


exports.getStudentAttendance = catchAsync(async(req,res)=>{
    const response = await studentAttendanceService.getStudentAttendance(req);
    res.status(200).json({status:true, message:"Batch attendance get succesfully", data: response})
})