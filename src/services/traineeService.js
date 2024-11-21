const Auth = require("../models/authModel");
const TraineeModel = require("../models/traineeModel");
const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');
const validator = require('validator');
const uploadCloud = require("../utils/uploadCloud");
const TraineeDetailsModel = require("../models/traineeDetails");
const utils = require("../utils/utils");
const AssignedBatchModel = require("../models/assignedBatchesModel");
const BatchModel = require("../models/batchModel");



const generateTraineeLogId = async () => {
    // Find the last created admin based on the logId in descending order
    const lastTrainee = await TraineeModel.findOne().sort({ logId: -1 });
    const lostLogIdNumber = lastTrainee ? parseInt(lastTrainee.logId.split('-')[2],10) : 0;
    const newLogIdNumber = (lostLogIdNumber + 1).toString().padStart(3, '0');
 
    return `TRE-ID-${newLogIdNumber}`
 };



exports.createTrainee = async(req)=>{
    const { email, fullName, password,role,hybrid,batch} = req.body
    console.log(req.body);

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
      const fileExtension = req.files['profilePic'][0].originalname.split('.').pop();
      const fileName = `${Date.now()}.${fileExtension}`
      profilePic = await uploadCloud('tarineeProfile', req.files['profilePic'][0])


   }
   if (req.files['resumeUpload']) {
      resumeUpload = await uploadCloud('resume-file', req.files['resumeUpload'][0])      
   }


   const existingBatch  = await BatchModel.findOne({batchName:batch})
   console.log(existingBatch,"bigils");
   
   if (!existingBatch) {
    throw new ApiError(httpStatus.BAD_REQUEST, { message: "Batch does not exist" });
   } 

   const logId = await generateTraineeLogId();

   const hashedPassword = await utils.hashPassword(password)

   const newTrainee = new TraineeModel({
    ...req.body,
    logId,
    profilePic,
    resumeUpload,
    batch,
    password: hashedPassword
   })

   const assignedBatch = await AssignedBatchModel.findOneAndUpdate(
    { batchId: existingBatch._id },
    { trainee: newTrainee._id },
    { new: true, runValidators: true }
);


  console.log(assignedBatch,"tharun");
   
   const newAuth = new Auth({
    traineeId: newTrainee._id,
    email,
    profilePic,
    fullName,
    logId,
    role,
    hybrid,
    password: hashedPassword
   })

   
   await newTrainee.save();
   await newAuth.save();
//    await assignedBatch.save();

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
    const {authId} = req;
    const {_id} = req.params;
    console.log(_id,"sssss");
    

    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Trainee Id required"});
    }

    const trainee = await TraineeModel.findOne({_id})
    console.log(trainee,"uuuuuu");
    
    if (trainee) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Trainee not found"});
    }

    return trainee;
}


exports.editTrainee = async(req)=>{
    const { authId } = req
    const { _id } = req.params

    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Trainee id required"});
     }
  
     const trainee = await TraineeModel.findById(_id);
     const auth = await Auth.findOne({accountId:_id});
     
     if (!trainee) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Trainee not found"});
     }
     
     const updateData = {...req.body}

     if (req.file) {
        const fileExtension = req.file.originalname.split('.').pop();
        const fileName = `${_id}-${Date.now()}.${fileExtension}`
        const profilePic = await uploadCloud(`trainee-Profile${fileName}`,req.file)
        updateData.profilePic = profilePic;
     }

     const updateTrainee = await TraineeModel.findByIdAndUpdate(_id,updateData,
        {new: true, runValidators: true}
     )

     const updateAuth = await Auth.findOneAndUpdate({accountId:_id},updateData,
        {new: true, runValidators: true}
     )

     console.log("UpdateAurth",updateAuth);
     

     return updateTrainee;
}


exports.deleteTrainee = async(req)=>{
    const { authId } = req
    const { _id } = req.user

    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Trainee id required"});
     }

     const trainee = await TraineeModel.findById(_id);
     const auth = await Auth.findById({accountId:_id});

     if (!trainee) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Trainer not found"});
     }
  
     if (!auth) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Auth not found"});
     }
  
     await TraineeModel.findByIdAndDelete(_id);
     await Auth.findOneAndDelete({accountId: _id});
}