const BatchModel = require("../models/batchModel");
const TrainerModel = require("../models/trainerModel");
const ApiError = require("../utils/apiError");


const generateBatchId = async (courseName)=>{
   const courseNamePrefix ={
    FullstackWebDevelopment : 'FSWD',
    DigitalMarketing: 'DM'
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
    const { batchData } = req.body

    const existingBatch = await BatchModel.findOne(batchId)
    if (!existingBatch) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: 'Batch already exist'}); 
    }

    if (req.user.role !== 'superAdmin') {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: 'Only super admin can create staff'});
    }
    
    const batchId = await generateBatchId(courseName);
    const batchName = await generateBatchName();

    const newBatch = new BatchModel({
        ...batchData,
        batchId,
        batchName
    })

    await newBatch.save();

    if (trainers && trainers.length >0) {
        await TrainerModel.updateMany(
            {_id:{ $in: trainers }},
            {$addToSet:{assignedBatches: newBatch._id}}
        )
    }

    return newBatch;
}