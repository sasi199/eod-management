const AssessmentModel = require("../models/assessmentModel");
const BatchModel = require("../models/batchModel");
const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');



exports.createAssessment = async(req)=>{
    const { assessmentTitle, assessmentType, batch, questions }= req.body

    const batchExists = await BatchModel.findOne({batchName:batch})
    if (!batchExists) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Batch not found");
    }

    if (!Array.isArray(questions) || questions.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Questions must be a non-empty array");
    }

    questions.forEach((question, index) => {
        if (!question.questionText || !question.questionType) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                `Question ${index + 1} is missing required fields`
            );
        }

        if (question.questionType !== 'Text' && !question.mediaURL) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                `Media URL is required for question ${index + 1} with type ${question.questionType}`
            );
        }

        if (
            (question.questionType === 'PDF' || question.questionType === 'Image') &&
            !question.mediaType
        ) {
            throw new ApiError(
                httpStatus.BAD_REQUEST,
                `Media type is required for question ${index + 1} with type ${question.questionType}`
            );
        }
    });

    const newAssessment = new AssessmentModel({
        ...req.body,
        batch: batchExists._id,
        questions
    })

    await newAssessment.save();
    return newAssessment;
}


exports.getAssessmentAll = async(req)=>{
    const assessment = await AssessmentModel.find({});
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