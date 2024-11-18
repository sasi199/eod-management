const Auth = require("../models/authModel");
const TraineeModel = require("../models/traineeModel");
const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');
const validator = require('validator');
const uploadCloud = require("../utils/uploadCloud");
const TraineeDetailsModel = require("../models/traineeDetails");
const utils = require("../utils/utils");



const generateTraineeLogId = async () => {
    // Find the last created admin based on the logId in descending order
    const lastTrainee = await TraineeModel.findOne().sort({ logId: -1 });
    const lostLogIdNumber = lastTrainee ? parseInt(lastTrainee.logId.split('-')[2],10) : 0;
    const newLogIdNumber = (lostLogIdNumber + 1).toString().padStart(3, '0');
 
    return `TRE-ID-${newLogIdNumber}`
 };



exports.createTrainee = async(req)=>{
    const { email, fullName, password,role,hybrid} = req.body
    // console.log(req.body);

    const existingTrainee = await TraineeModel.findOne({email})
    if (existingTrainee) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: 'Trainee already exist'});   
    }
    
    if (req.user.role !== 'SuperAdmin') {
        throw new ApiError(httpStatus.FORBIDDEN, {message: 'Only super admin can create trainee'}); 
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "Provide a valid email"});
    }

    let profilePic,resumeUpload;
   if (req.files['profilePic']) {
      profilePic = await uploadCloud('tarineeProfile', req.files['profilePic'][0])      
   }
   if (req.files['resumeUpload']) {
      resumeUpload = await uploadCloud('resume-file', req.files['resumeUpload'][0])      
   }

   const logId = await generateTraineeLogId();

   const hashedPassword = await utils.hashPassword(password)

   const newTrainee = new TraineeModel({
    ...req.body,
    logId,
    profilePic,
    resumeUpload,
    password: hashedPassword
   })

   const newAuth = new Auth({
    traineeId: newTrainee._id,
    email,
    logId,
    role,
    hybrid,
    password: hashedPassword
   })

   
   await newTrainee.save();
   await newAuth.save();

   return newTrainee;
    
}


exports.getTraineeAll = async(req)=>{
    const trainee = await TraineeModel.find({})
    if (!trainee) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Trainer not found"});
    }

    return trainee;
}


exports.getTraineeId = async(req)=>{
    const {authId} = req._id;
    const {traineeId} = req.user;

    if (traineeId) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Trainer Id required"});
    }

    const trainee = await TraineeModel.findById(traineeId)
    if (trainee) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Triner not found"});
    }

    return trainee;
}


exports.editTrainee = async(req)=>{
    const { authId } = req._id
    const { traineeId } = req.user

    if (!traineeId) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Trainee id required"});
     }
  
     const trainee = await TraineeModel.findById(trainerId);
     if (!trainee) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Trainee not found"});
     }
     
     const updateData = {...req.body}

     if (req.file) {
        const profilePic = await uploadCloud('adminProfile', req.file);
        updateData.profilePic = profilePic;
     }

     const updateTrainee = await TraineeModel.findByIdAndUpdate(traineeId,updateData,
        {new: true, runValidators: true}
     )

     const updateAuth = await Auth.findByIdAndUpdate(authId,updateData,
        {new: true, runValidators: true}
     )

     return updateTrainee;
}


exports.deleteTrainee = async(req)=>{
    const { authId } = req._id
    const { traineeId } = req.user

    if (!traineeId) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Trainee id required"});
     }

     const trainee = await TraineeModel.findById(traineeId);
     const auth = await Auth.findById(authId);

     if (!trainee) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Trainer not found"});
     }
  
     if (!auth) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Auth not found"});
     }
  
     await TraineeModel.findByIdAndDelete(traineeId);
     await Auth.findByIdAndDelete(authId);
}