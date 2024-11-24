const SyllabusModel = require("../models/syllabusModel");
const httpStatus = require('http-status');
const ApiError = require("../utils/apiError");
const uploadCloud = require("../utils/uploadCloud");



exports.createSyllabus = async(req)=>{
    const {courseName, subjectName,} = req.body;
    
    if (!courseName || !subjectName) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "All field wre required"});
    }

    let uploadFile;
    if (req.file) {
        const fileExtension = req.file.originalname.split('.').pop();
        const fileName = `${Date.now()}.${fileExtension}`
        uploadFile = await uploadCloud(`syllabus/${fileName}`,req.file)
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
    if (_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Syllabus id required"}); 
    }

    const syllabus = await SyllabusModel.findById(_id);
    if (!syllabus) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Syllabus not found"}); 
    }

    const updateData = req.body;

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
    if (_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Syllabus id required"}); 
    }

    const syllabus = await SyllabusModel.findById(_id);
    if (!syllabus) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message: "Syllabus not found"}); 
    }

    await SyllabusModel.findByIdAndUpdate(_id);

}