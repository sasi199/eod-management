const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');
const utils = require("../utils/utils");
const AdminModel = require("../models/adminModel");




exports.adminLogin = async(req,res,next)=>{
   const { email, password } = req.body;

   const admin = await AdminModel.findOne({email})
   if (!admin) {
    throw new ApiError(httpStatus.BAD_REQUEST, {message:"Invalid Email",status:false,field:"email"});
    
   }

   const isPasswordCorrect = await utils.comparePassword(password, admin.password);
   if (isPasswordCorrect) {
    throw new ApiError(httpStatus.BAD_REQUEST, {message:"Invalid password"});
   }
   return admin;
}



