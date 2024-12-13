const {AssignedBatchModel} = require("../models/assignedBatchesModel");
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

const generateBatchName = async() =>{
    const now = new Date();
    const options = { month: 'short'};
    const month = new Intl.DateTimeFormat('en-us', options).format(now);
    const date = now.getDate();
    const year = now.getFullYear();

     const baseName = `${month}-${date}-${year}`;

     const count = await BatchModel.countDocuments({ batchName: { $regex: `^${baseName}` } });

     return `${baseName}-${count + 1}`;
}


exports.createBatch = async(req)=>{
    const { authId } = req
    const { courseName, courseDuration, batchTimings, trainer,} = req.body
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
        
    const batchName = await generateBatchName();

    const newBatch = new BatchModel({
        batchId,
        batchName,
        batchTimings,
        courseName,
        courseDuration,
    })

    await newBatch.save();

    const assignBatchPromises = trainerId.map(async (trainer) => {
        const newAssignBatch = new AssignedBatchModel({
            batchId: newBatch._id,
            trainer: trainer._id,
        });

        // Save the assignment for each trainer
        await newAssignBatch.save();
    });

    // Wait for all trainers to be assigned
    await Promise.all(assignBatchPromises);

    return newBatch;
}


exports.getBatchAll = async (req) => {
        const result = await BatchModel.aggregate([
            {
                
                $lookup: {
                    from: "AssignedBatch",
                    localField: "_id",
                    foreignField: "batchId",
                    as: "assignedData"
                }
            },
            // {
                
            //     $unwind: {
            //         path: "$assignedData",
            //         preserveNullAndEmptyArrays: true
            //     }
            // },
            {
                
                $lookup: {
                    from: "Staff",
                    localField: "assignedData.trainer",
                    foreignField: "_id",
                    as: "trainerDetails"
                }
            },
            {
                
                $lookup: {
                    from: "Trainee",
                    localField: "assignedData.trainee",
                    foreignField: "_id",
                    as: "traineeDetails"
                }
            },
            {
                $project: {
                    courseName: 1,
                    batchId: 1,
                    batchName: 1,
                    batchTimings: 1,
                    courseDuration: 1,
                    active: 1,
                    archive: 1,
                    maxStrength: 1,
                    createdAt: 1,
                    updatedAt: 1,
                    trainerDetails: {
                        _id: 1,
                        fullName: 1,
                        profilePic: 1
                    },
                    traineeDetails: {
                        _id: 1,
                        fullName: 1,
                        profilePic: 1
                    }
                }
            }
        ]);

        return result;
};


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

    const update =  await AssignedBatchModel.findOneAndUpdate({batchId:_id},updateData,
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