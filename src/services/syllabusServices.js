const SyllabusModel = require("../models/syllabusModel");
const httpStatus = require('http-status');
const ApiError = require("../utils/apiError");
const uploadCloud = require("../utils/uploadCloud");



exports.createSyllabus = async(req)=>{
    const { assessmentTitle, assessmentType, batch, question } = req.body;
    
    const batchExists = await BatchModel.findOne({ batchName: batch });
    if (!batchExists) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Batch not found");
    }

    const { questionText, questionType, viewStartTime, viewEndTime } = question;
    let mediaURL;

    if (!questionText || !questionType) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Question is missing required fields");
    } if (['Image', 'PDF'].includes(questionType)) {
        if (!req.file) {
            throw new ApiError(httpStatus.BAD_REQUEST, `File is required for question type: ${questionType}`);
        }
        const fileExtension = req.file.originalname.split('.').pop();
        const fileName = `${Date.now()}.${fileExtension}`;
        mediaURL = await uploadCloud(`syllabus/${fileName}`, req.file);
    }

    

    const newSyllabus = new SyllabusModel({
        ...req.body,
        uploadFile
    })

    await newSyllabus.save();
    return newSyllabus;
}


exports.getSyllabusAll = async(req)=>{
    const syllabus = await SyllabusModel.find({});
    if (!syllabus) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Syllabus not found"});
    }
    return syllabus;
}

exports.getSyllabusId = async(req)=>{
    const { _id } = req.params;
    if (_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Syllabus id required"});   
    }

    const syllabus = await SyllabusModel.findById(_id);
    if (!syllabus) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Syllabus not found"}); 
    }

    return syllabus;
}


exports.editSyllabus = async(req)=>{
    const { _id } = req.params;
    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Syllabus id required"}); 
    }

    const syllabus = await SyllabusModel.findById(_id);
    if (!syllabus) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Syllabus not found"}); 
    }

    const updateData = {...req.body};

    let uploadFile;
    if (req.file) {
        const fileExtension = req.file.originalname.split('.').pop();
        const fileName = `${_id}-${Date.now()}.${fileExtension}`
        const uploadFile = await uploadCloud(`syllabus${fileName}`,req.file)
        updateData.uploadFile = uploadFile; 
    }

    const updateSyllabus = await SyllabusModel.findByIdAndUpdate(
        _id,
        updateData,
        uploadFile,
        {new:true,runValidators:true}
    )

    await updateSyllabus.save();
    return updateSyllabus;
}


exports.deleteSyllabus = async(req)=>{

    const { _id } = req.params;
    console.log("gaahajja",req.params);
    
    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Syllabus id required"}); 
    }

    const syllabus = await SyllabusModel.findById(_id);
    console.log("gaahajja",syllabus);
    if (!syllabus) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Syllabus not found"}); 
    }

    await SyllabusModel.findByIdAndDelete(_id);

}