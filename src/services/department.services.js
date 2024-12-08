const { default: status } = require("http-status");
const ApiError = require("../utils/apiError");
const {DepartmentModel} = require("../models/department.model");

exports.createDepartment = async (req)=>{
    const {...dataToCreate} = req.body;

    if(!dataToCreate.name){
        throw new ApiError(status.BAD_REQUEST, "Department name is required");
    }

    const createdDepartment = await DepartmentModel.create(dataToCreate);

    if(!createdDepartment){
        throw new ApiError(status.INTERNAL_SERVER_ERROR, "Failed to create department");
    }

    return createdDepartment;
}

exports.getAllDepartments = async (req)=>{
    const departments = await DepartmentModel.find();
    // if(!departments){
    //     throw new ApiError(status.INTERNAL_SERVER_ERROR, "Something went wrong please try again");
    // }
    if(departments.length<1){
        throw new ApiError(status.NOT_FOUND, "No departments found");
    }
    return departments;
}

exports.updateDepartment = async (req)=>{
    const {...dataToUpdate} = req.body;
    const {department_id} = req.params;
    const updatedDepartment = await DepartmentModel.findByIdAndUpdate(department_id,dataToUpdate);

    if(!updatedDepartment){
        throw new ApiError(status.INTERNAL_SERVER_ERROR, "Failed to update department");
    }

    return updatedDepartment;
}


exports.deleteDepartment = async (req)=>{
    const {department_id} = req.params;

    const deletedDepartment = await DepartmentModel.findByIdAndDelete(department_id);

    if(!deletedDepartment){
        throw new ApiError(status.INTERNAL_SERVER_ERROR, "Unable to delete the department please try again");
    }

    return deletedDepartment;
}