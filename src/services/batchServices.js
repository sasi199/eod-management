const AssignedBatchModel = require("../models/assignedBatchesModel");
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
    const { authId } = req
    
    const { courseName, courseDuration, batchTimings, trainer, trainee } = req.body
    console.log(req.body,"eeeeeeeeee");
    

    const batchId = await generateBatchId(courseName);
    
    if (!batchId) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: 'Invalid course name provided' });
    }

    const trainerId = await StaffModel.find({ _id: { $in: trainer },isTrainer:true});
    console.log("gfdfddg",trainerId);
    
    if (!trainerId) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: 'Trainer not found' });
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
        batchTimings,
        courseName,
        courseDuration,
    })

    await newBatch.save();

    const newAssignBatch = new AssignedBatchModel({
        batchId: newBatch._id,
        trainer: trainerId.map((t) => t._id),
        trainee
    })

    await newAssignBatch.save()

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
    // const { _id } = req.params
    console.log(req.params,"jajahjaha");
    

    if (_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Batch id required"});
    }

    const batch = await BatchModel.findById(_id)
    if (!batch) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Batch not found"});
    }

    const assigned = await AssignedBatchModel.findOne({ batchId: _id });
    if (!assigned) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "No trainers or trainees assigned to this batch" });
    }

    const trainerDetails = await StaffModel.find({ _id: { $in: assigned.trainer } },{ fullName: 1, profilePic: 1 });
    console.log(trainerDetails,'llalllala');
    
    const traineeDetails = await TraineeModel.find({ _id: { $in: assigned.trainee } });

    return {
        batchDetails: batch,
        trainerDetails,
        traineeDetails
    };
}

exports.getBatchId = async (req) => {
        const { authId } = req;
        const { _id } = req.params;

        if (!_id) {
            throw new ApiError(httpStatus.BAD_REQUEST, { message: "Batch id required" });
        }

        const batch = await BatchModel.findById(_id);
        if (!batch) {
            throw new ApiError(httpStatus.BAD_REQUEST, { message: "Batch not found" });
        }

        const assigned = await AssignedBatchModel.findOne({ batchId: _id });
        if (!assigned) {
            throw new ApiError(httpStatus.BAD_REQUEST, { message: "No trainers or trainees assigned to this batch" });
        }

        const trainerDetails = await StaffModel.find(
            { _id: { $in: assigned.trainer } },
            { fullName: 1, profilePic: 1 }
        );

        const traineeDetails = await TraineeModel.find(
            { _id: { $in: assigned.trainee } }
        );

        return {
            batchDetails: batch,
            trainerDetails,
            traineeDetails
        };
   
};



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

    const update =  await BatchModel.findOneAndUpdate(_id,updateData,
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


exports.batchCount = async(req)=>{
    const batch = await BatchModel.countDocuments({});
    if (!batch) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"batch not found"});
    }

    return batch;
}