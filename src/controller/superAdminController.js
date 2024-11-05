const { getAuthToken } = require("../middlewares/jwt.config");
const superAdmin = require("../services/superAdminService");
const catchAsync = require("../utils/catchAsync");



exports.superAdminLogin = catchAsync (async(req,res)=>{
    const response = await superAdmin.superAdminLogin(req)
    let authToken = null;
    if (response) {
        authToken = await getAuthToken(response);
    }
    res.status(200).json({status:true, message: "Login successfully", data:response, authToken})

})