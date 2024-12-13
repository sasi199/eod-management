const { default: status } = require("http-status");
const ApiError = require("../utils/apiError");
const { DesignationModel } = require("../models/designation.model");
const { DepartmentModel } = require("../models/department.model");

exports.createDesignation = async (req)=>{
    const {...dataToCreate} = req.body;

    if(!dataToCreate.title){
        throw new ApiError(status.BAD_REQUEST, "Designation title is required");
    }

    if(!dataToCreate.department_id){
        throw new ApiError(status.BAD_REQUEST,"Please select a department to create a designation");
    }

    const isDepartmentExist = await DepartmentModel.exists({_id:dataToCreate.department_id});
    console.log(isDepartmentExist,"akaklalalal");
    

    if(!isDepartmentExist){
        throw new ApiError(status.NOT_FOUND,"Please Select a valid department");
    }


    const createdDesignation = await DesignationModel.create(dataToCreate);

    if(!createdDesignation){
        throw new ApiError(status.INTERNAL_SERVER_ERROR, "Failed to create designation");
    }

    return createdDesignation;
}

exports.getAllDesignations = async (req)=>{
    const designations = await DesignationModel.find();

    // if(designations){
    //     throw new ApiError(status.INTERNAL_SERVER_ERROR, "Something went wrong please try again");
    // }

    if(designations.length<1){
        throw new ApiError(status.NOT_FOUND, "No designations found");
    }

    return designations;
}

exports.updateDesignation = async (req)=>{
    const {...dataToUpdate} = req.body;
    const {designation_id} = req.params;

    const updatedDesignation = await DesignationModel.findByIdAndUpdate(designation_id,dataToUpdate);

    if(!updatedDesignation){
        throw new ApiError(status.NOT_FOUND, "Designation not found");
    }

    return updatedDesignation;
}


exports.deleteDesignation = async (req)=>{
    const {designation_id} = req.params;

    const deletedDesignation = await DesignationModel.findByIdAndDelete(designation_id);

    if(!deletedDesignation){
        throw new ApiError(status.NOT_FOUND, "Unable to delete the designation please try again");
    }

    return deletedDesignation;
}