const catchAsync = require("../utils/catchAsync");
const RoleServices= require("../services/role.services");

exports.createRole = catchAsync(async(req, res)=>{
    const response = await RoleServices.createRole(req);
    res.status(201).json({success: true, message:"Role created Successfully", data:response});
})
exports.getAllRoles = catchAsync(async(req, res)=>{
    const response = await RoleServices.getAllRoles(req);
    res.status(200).json({success: true, message:"Role fetched Successfully", data:response});
})
exports.updateRole = catchAsync(async(req, res)=>{
    const response = await RoleServices.updateRole(req);
    res.status(200).json({success: true, message:"Role updated Successfully", data:response});
})
exports.deleteRole = catchAsync(async(req, res)=>{
    const response = await RoleServices.deleteRole(req);
    res.status(200).json({success: true, message:"Role deleted Successfully", data:response});
})