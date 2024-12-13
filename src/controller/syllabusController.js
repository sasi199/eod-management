const syllabusServices = require("../services/syllabusServices");
const catchAsync = require("../utils/catchAsync");



exports.createSyllabus = catchAsync(async(req,res)=>{
    const response = await syllabusServices.createSyllabus(req);
    res.status(200).json({status:true, message:"Syllabus created succesfully", data: response})
})

exports.getSyllabusAll = catchAsync(async(req,res)=>{
    const response = await syllabusServices.getSyllabusAll(req);
    res.status(200).json({status:true, message:"Syllabus get succesfully", data: response})
})
exports.getSyllabusId = catchAsync(async(req,res)=>{
    const response = await syllabusServices.getSyllabusId(req);
    res.status(200).json({status:true, message:"Syllabus get succesfully", data: response})
})
exports.editSyllabus = catchAsync(async(req,res)=>{
    const response = await syllabusServices.editSyllabus(req);
    res.status(200).json({status:true, message:"Syllabus updated succesfully", data: response})
})
exports.deleteSyllabus = catchAsync(async(req,res)=>{
    const response = await syllabusServices.deleteSyllabus(req);
    res.status(200).json({status:true, message:"Syllabus deleted succesfully", data: response})
})