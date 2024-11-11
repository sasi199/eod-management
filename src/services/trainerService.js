const TrainerModel = require('../models/trainerModel');
const ApiError = require('../utils/apiError');
const httpStatus = require('http-status');
const uploadCloud = require('../utils/uploadCloud');
const Auth = require('../models/authModel');



const generateTrainerLogId = async () => {
    // Find the last created admin based on the logId in descending order
    const lastTrainer = await TrainerModel.findOne().sort({ logId: -1 });
    const lostLogIdNumber = lastTrainer ? parseInt(lastTrainer.logId.split('-')[2],10) : 0;
    const newLogIdNumber = (lostLogIdNumber + 1).toString().padStart(3, '0');
 
    return `TRN-ID-${newLogIdNumber}`
 };



exports.createTrainer = async(req)=>{
    const { email, fullName, role} = req.body
    console.log(req.body);

    const existingTrainer = await TrainerModel.findOne({email})
    if (existingTrainer) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: 'Trainer already exist'});
    }

    if (req.user.role !== 'superAdmin') {
        throw new ApiError(httpStatus.FORBIDDEN, {message: 'Trainer already exist'}); 
    }

    if (!validator.isEmail(email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "Provide a valid email"});
    }

    let profilePic;
   if (req.file) {
      profilePic = await uploadCloud('adminProfile', req.file)      
   }

   const logId = await generateTrainerLogId();

   const newTrainer = new TrainerModel({
    ...req.body,
    logId,
    profilePic
   })

   const newAuth = new Auth({
    trainerId: newTrainer._id,
    email,
    logId,
    role
   })

   await newTrainer.save();
   await newAuth.save();

   return newTrainer;
}


exports.getTrainerAll = async(req)=>{
    const trainer = await TrainerModel.find({});
    if (trainer) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Trainer not found"});
    }

    return trainer;
}


exports.getTrainerById = async(req)=>{
    const {authId} = req._id;
    const {trainerId} = req.user;

    if (trainerId) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Trainer Id required"});
    }

    const trainer = await TrainerModel.findById(trainerId)
    if (trainer) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Triner not found"});
    }

    return trainer;
}


exports.editTrainer = async(req)=>{
    const { authId } = req._id
    const { trainerId } = req.user

    if (!trainerId) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Trainer id required"});
     }
  
     const trainer = await TrainerModel.findById(trainerId);
     if (!trainer) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Trainer not found"});
     }
     
     const updateData = {...req.body}

     if (req.file) {
        const profilePic = await uploadCloud('adminProfile', req.file);
        updateData.profilePic = profilePic;
     }

     const updateTrainer = await TrainerModel.findByIdAndUpdate(trainerId,updateData,
        {new: true, runValidators: true}
     )

     const updateAuth = await Auth.findByIdAndUpdate(authId,updateData,
        {new: true, runValidators: true}
     )

     return updateTrainer;
}


exports.deleteTrainer = async(req)=>{
    const { authId } = req._id
    const { trainerId } = req.user

    if (!trainerId) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Trainer id required"});
     }

     const trainer = await TrainerModel.findById(trainerId);
     const auth = await Auth.findById(authId);

     if (!trainer) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Trainer not found"});
     }
  
     if (!auth) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Auth not found"});
     }
  
     await TrainerModel.findByIdAndDelete(trainerId);
     await Auth.findByIdAndDelete(authId);
}