const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');
const utils = require("../utils/utils");
const SuperAdminModel = require("../models/superAdminModel");




// exports.superAdminLogin = async(req,res,next)=>{
//    const { email, password } = req.body;

//    const superAdmin = await SuperAdminModel.findOne({email})
//    if (!superAdmin) {
//     throw new ApiError(httpStatus.BAD_REQUEST, {message:"Invalid Email",status:false,field:"email"});
    
//    }

//    const isPasswordCorrect = await utils.comparePassword(password, superAdmin.password);
//    if (isPasswordCorrect) {
//     throw new ApiError(httpStatus.BAD_REQUEST, {message:"Invalid password"});
//    }
//    return superAdmin;
// }



