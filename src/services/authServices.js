const Auth = require("../models/authModel");
const ApiError = require("../utils/apiError");
const utils = require("../utils/utils");




exports.authCreation = async(req)=>{
    const {email, userName} = req.body
    let findEmail = await Auth.findOne({email});
    if (findEmail) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"User already exist",status:false,field:"email"});
    }

    const newAuth = await Auth.create({
        ...req.body
    })
    await newAuth.save();
    return newAuth;
}