const config = require("../config/config");
const Auth = require("../models/authModel");
const ApiError = require("../utils/apiError");
const utils = require("../utils/utils");
const httpStatus = require('http-status');



exports.loginByEmailAndLogId = async(req)=>{
    const { email,role } = req.body
    
    const user = await Auth.findOne({email,role});
    if (!user) {
        throw new ApiError(httpStatus.UNAUTHORIZED, {message:"Invalid credantials",status:false,});
      }

      if (!user.active) {
        throw new ApiError(httpStatus.FORBIDDEN, "Your account is inactive. Please contact support.");
      }
      if (user.archive) {
        throw new ApiError(httpStatus.FORBIDDEN, "Your account is archived and cannot be used.");
      }

      const token = jwt.sign(
        {id:user._id, role:user.role},
        config.jwt.secret,
        {expiresIn: config.jwt.expiresIn}
      )

      return token;
}


exports.authCreation = async(req)=>{
    const {email, userName,role} = req.body
    let findEmail = await Auth.findOne({email});
    if (findEmail) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"User already exist",status:false,field:"email"});
    }

    
  if (!userRole.includes(role)) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid user role");
  }

    const newAuth = await Auth.create({
        ...req.body
    })
    await newAuth.save();
    return newAuth;
}


exports.authUpdate = async(req) =>{
    const { id } = req.params
    const {userId, role, ...updateData } = req.body;

    const user = await Auth.findById(id);
    
    if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, { message: "User not found", status: false });
  }
    

    let authUpdate = await Auth.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true, runValidators: true }
    );

    return authUpdate
}

