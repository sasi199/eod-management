const DepartmentService = require('../services/department.services');
const catchAsync = require('../utils/catchAsync');


exports.createDepartment = catchAsync(async (req,res)=>{
    const response = await DepartmentService.createDepartment(req);

    res.status(201).json({success: true, message: "Department created successfully", data: response});
})

exports.getAllDepartments = catchAsync(async (req,res)=>{
    const response = await DepartmentService.getAllDepartments(req);

    res.status(200).json({success: true, message: "Departments fetched successfully", data: response});
})

exports.updateDepartment = catchAsync(async (req,res)=>{
    const response = await DepartmentService.updateDepartment(req);

    res.status(200).json({success: true, message: "Department updated successfully",data : response});
})

exports.deleteDepartment = catchAsync(async (req,res)=>{
    const response = await DepartmentService.deleteDepartment(req);

    res.status(200).json({success: true, message: "Department deleted successfully"});
})