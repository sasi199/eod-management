const AssessmentModel = require("../models/assessmentModel");
const BatchModel = require("../models/batchModel");
const QuestionModel = require("../models/quetionsModel");
const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');
const uploadCloud = require("../utils/uploadCloud");



exports.createAssessment = async(req)=>{
    const { assessmentTitle, assessmentType, batch,mediaType}= req.body

    const batchExists = await BatchModel.findOne({batchName:batch})
    if (!batchExists) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Batch not found");
    }

    // let mediaUrl;
    // if (req.file) {
    //     const fileExtension = req.file.originalname.split('.').pop();
    //     const fileName = `${Date.now()}.${fileExtension}`;
    //     mediaUrl = await uploadCloud(`assessment/${fileName}`, req.file);

    let mediaUrl;

    
    if (['Image', 'PDF'].includes(mediaType)) {
        if (!req.file) {
            throw new ApiError(httpStatus.BAD_REQUEST, `File is required for media type: ${mediaType}`);
        }

        const fileExtension = req.file.originalname.split('.').pop();
        const fileName = `${Date.now()}.${fileExtension}`;
        mediaUrl = await uploadCloud(`assessment/${fileName}`, req.file);
    }

    if (mediaType === 'Quiz') {
        if (!quizLink) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Quiz link is required for media type: Quiz");
        }
        mediaUrl = quizLink;
    }


    if (!mediaUrl) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Media URL could not be processed");
    }

        const newAssessment = new AssessmentModel({
            ...req.body,
            mediaUrl,
            batch: batchExists._id,
        });

        await newAssessment.save();
        return newAssessment;
    
}


exports.getAssessmentAll = async(req)=>{
    const assessment = await AssessmentModel.find({}).populate('quetion');
    if (!assessment) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Assessments not found");
    }
    return assessment;
}


exports.getAssessmentId = async(req)=>{
    const {authId} = req;
    const { _id } = req.params;

    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Assessment _id required");
    }

    const assessment = await AssessmentModel.findOne(_id)
    if (!assessment) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Assessment not found");
        
    }

}


exports.editAssessment = async(req)=>{
    const {authId} = req;
    const { _id } = req.params;

    if (_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Assessment _id required")
    }

    const assessment = await AssessmentModel.findOne(_id);
    if (!assessment) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Assessment not  found");
    }

    const updateData = {...req.body};

    const updateAssessment = await AssessmentModel.findByIdAndUpdate(_id,updateData,
        {new:true,runValidators:true}
    )

    return updateAssessment;
}


exports.deleteAssessment = async(req)=>{
    const {authId} = req;
    const { _id } = req.params;

    if (_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Assessment _id required")
    }

    const assessment = await AssessmentModel.findOne(_id);
    if (!assessment) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Assessment not  found");
    }

    await AssessmentModel.findByIdAndDelete(_id);
    
}