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