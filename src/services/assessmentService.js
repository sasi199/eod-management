const AssessmentModel = require("../models/assessmentModel");
const BatchModel = require("../models/batchModel");



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
}