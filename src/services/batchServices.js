const BatchModel = require("../models/batchModel");
const StaffModel = require("../models/staffModel");
const TraineeModel = require("../models/traineeModel");
const TrainerModel = require("../models/trainerModel");
const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');


const generateBatchId = async (courseName)=>{
   const courseNamePrefix ={
    "Full Stack" : 'FSWD',
    "Digital Marketing": 'DM'
   }

    const prefix = courseNamePrefix[courseName]
    const lastBatch = await BatchModel.findOne({courseName})
    .sort({createdAt: -1})
    .select('batchId')
    .lean();
    

    let newIdNumber = 1;
    if (lastBatch && lastBatch.batchId) {
        const lastIdNumber = parseInt(lastBatch.batchId.split('-')[2],10);
        newIdNumber = lastIdNumber +1
    }

    const formattedId = String(newIdNumber).padStart(3,'0')
    return `${prefix}-ID-${formattedId}`
}

const generateBatchName = () =>{
    const now = new Date();
    const options = { month: 'short'};
    const month = new Intl.DateTimeFormat('en-us', options).format(now);
    const date = now.getDate();
    const year = now.getFullYear();

    return `${month}-${date}-${year}`
}


exports.createBatch = async(req)=>{
    const { courseName, courseDuration, batchTimings, trainers, trainees } = req.body
    console.log(req.body,"eeeeeeeeee");
    

    const batchId = await generateBatchId(courseName);
    // console.log(batchId,"ggggggg");
    
    if (!batchId) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: 'Invalid course name provided' });
    }

    const existingBatch = await BatchModel.findOne({batchId});
    if (existingBatch) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: 'Batch already exist'}); 
    }

    if (req.user.role !== 'SuperAdmin') {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: 'Only super admin can create staff'});
    }
    
    const batchName = await generateBatchName();

    const newBatch = new BatchModel({
        batchId,
        batchName,
        courseName,
        courseDuration,
        batchTimings
    })

    await newBatch.save();

    if (trainers && trainers.length >0) {
        await StaffModel.updateMany(
            {_id:{ $in: trainers }},
            {$addToSet:{assignedBatches: newBatch._id}}
        )
    }

    if (trainees && trainees.length >0) {
        await TraineeModel.updateMany(
            {_id:{ $in: trainees }},
            {$addToSet:{assignedBatch: newBatch._id}}
        )
    }

    return newBatch;
}


exports.getBatchAll = async(req)=>{
    const batch = await BatchModel.find({})
    if (!batch) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Batch not found"});
    }

    return batch;
}


exports.getBatchId = async(req)=>{
    const { authId } = req
    const { _id } = req.params

    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Batch id required"});
    }

    const batch = await BatchModel.findById(_id)
    if (!batch) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Batch not found"});
    }
    return batch;
}


exports.editBatch = async(req)=>{
    const { authId } = req;
    const { _id } = req.params;

    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Batch id required"});
    }

    const batch = await BatchModel.findById(_id);
    if (!batch) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Batch not found"});
    }

    const updateData = {...req.body}
    const updateBatch =  await BatchModel.findByIdAndUpdate(_id,updateData,
        {new: true, runValidators: true}
    )

    return updateBatch;

}


exports.deleteBatch = async(req)=>{
    const { authId } = req;
    const { _id } = req.params;

    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Batch id required"});
    }

    const batch = await BatchModel.findById(_id)
    if (!batch) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: "Btach not found"});
     }

     await BatchModel.findByIdAndDelete(_id);
}