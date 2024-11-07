const BatchModel = require("../models/batchModel");
const ApiError = require("../utils/apiError");




exports.createBatch = async(req)=>{
    const {batchName,batchId} = req.body

    const existingBatch = await BatchModel.findOne(batchId)
    if (!existingBatch) {
        throw new ApiError(httpStatus.BAD_REQUEST,{message: 'Batch already exist'}); 
    }
    
}