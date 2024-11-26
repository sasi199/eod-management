const AssessmentModel = require("../models/assessmentModel");
const BatchModel = require("../models/batchModel");
const QuestionModel = require("../models/quetionsModel");
const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');
const uploadCloud = require("../utils/uploadCloud");



exports.createAssessment = async(req)=>{
    const { assessmentTitle, assessmentType, batch, question }= req.body

    const batchExists = await BatchModel.findOne({batchName:batch})
    if (!batchExists) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Batch not found");
    }

    const { questionType, mediaType, viewStartTime, viewEndTime } = question;
    let mediaURL;

    
    if (['Image', 'PDF'].includes(questionType)) {
        if (!req.file) {
            throw new ApiError(httpStatus.BAD_REQUEST, `File is required for question type: ${questionType}`);
        }

        const fileExtension = req.file.originalname.split('.').pop();
        const fileName = `${Date.now()}.${fileExtension}`;
        mediaURL = await uploadCloud(`syllabus/${fileName}`, req.file);

        if (questionType === 'Text' && mediaURL) {
            throw new ApiError(httpStatus.BAD_REQUEST, "Media URL should not be provided for text questions");
        }

        const newQuestion = new QuestionModel({
            assessmentId: null,
            questionType,
            mediaURL,
            mediaType: req.file ? req.file.mimetype : undefined,
            viewStartTime,
            viewEndTime
        });

         await newQuestion.save();

        const newAssessment = new AssessmentModel({
            assessmentTitle,
            assessmentType,
            batch: batchExists._id,
            question: [newQuestion._id],
        });

        await newAssessment.save();

        newQuestion.assessmentId = newAssessment._id;
        await savedQuestion.save();
        return newAssessment;
    }

        

    const newAssessment = new AssessmentModel({
        assessmentTitle,
            ...req.body,
            batch: batchExists._id,
            question: savedQuestion._id,
    })

     await newAssessment.save();

    const newQuestion = new QuestionModel({
        assessmentId: null,
        questionText,
        questionType,
        mediaURL,
        mediaType,
        viewStartTime,
        viewEndTime
    });
    const savedQuestion = await newQuestion.save();

    savedQuestion.assessmentId = newAssessment._id;
    await savedQuestion.save();

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