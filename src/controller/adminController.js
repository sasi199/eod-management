const catchAsync = require("../utils/catchAsync");
const adminService = require("../services/adminServices");
const { getAuthToken } = require("../middlewares/jwt.config");



exports.adminLogin = catchAsync (async(req,res)=>{
    const response = await adminService.adminLogin(req);
    let authToken = null
    if (response) {
        authToken = await getAuthToken(response);
        console.log("auth token",);
    }
    res.status(200).json({status:true, message:'Login succesfull',data:response,authToken})
})


exports.createAdmin = catchAsync (async(req,res)=>{
    const response = await adminService.createAdmin(req);
    res.status(200).json({status:true, message:'Admin created succesfully',data:response})
})