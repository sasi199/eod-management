const DesignationService = require('../services/designation.services');
const catchAsync = require('../utils/catchAsync');


exports.createDesignation = catchAsync(async (req,res)=>{
    const response = await DesignationService.createDesignation(req);

    res.status(201).json({success: true, message: "Designation created successfully", data: response});
})

exports.getAllDesignations = catchAsync(async (req,res)=>{
    const response = await DesignationService.getAllDesignations(req);

    res.status(200).json({success: true, message: "Designations fetched successfully", data: response});
})

exports.updateDesignation = catchAsync(async (req,res)=>{
    const response = await DesignationService.updateDesignation(req);

    res.status(200).json({success: true, message: "Designation updated successfully",data : response});
})

exports.deleteDesignation = catchAsync(async (req,res)=>{
    const response = await DesignationService.deleteDesignation(req);

    res.status(200).json({success: true, message: "Designation deleted successfully"});
})