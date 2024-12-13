const { default: status } = require("http-status");
const ApiError = require("../utils/apiError");
const { SalaryConfigModel } = require("../models/salaryConfig.model");

// Helper function to format the modification history entry
const getModifiedHistoryEntry = (_id,modifiedFields) => {
    const date = new Date().toLocaleDateString('en-GB'); // dd/mm/yyyy format
    return { _id, date, modifiedFields };
};

exports.createSalaryConfig = async (req) => {
    const { 
        isEmployerEsi, isEmployerPf, pf, employerPF, esi, employerEsi, basic, hra, 
        conveyance, otherAllowance, sickLeave, casualLeave, permission, permissionDuration, 
        checkInTime, checkOutTime, graceTime, workingHours, approvedLate, startDeductFrom 
    } = req.body;

    // Create the salary configuration
    const newSalaryConfig = await SalaryConfigModel.create({
        isEmployerEsi, isEmployerPf, pf, employerPF, esi, employerEsi, basic, hra, 
        conveyance, otherAllowance, sickLeave, casualLeave, permission, permissionDuration, 
        checkInTime, checkOutTime, graceTime, workingHours, approvedLate, startDeductFrom,
        lastModified: []  // Initial empty array for lastModified
    });

    if (!newSalaryConfig) {
        throw new ApiError(status.INTERNAL_SERVER_ERROR, "Failed to create salary config");
    }

    return newSalaryConfig;
};

exports.getAllSalaryConfigs = async () => {
    const salaryConfigs = await SalaryConfigModel.find();

    if (salaryConfigs.length < 1) {
        throw new ApiError(status.NOT_FOUND, "No salary configs found");
    }

    return salaryConfigs;
};

exports.getSalaryConfigById = async (req) => {
    const { configId } = req.params;

    const salaryConfig = await SalaryConfigModel.findById(configId);

    if (!salaryConfig) {
        throw new ApiError(status.NOT_FOUND, "Salary config not found");
    }

    return salaryConfig;
};

exports.updateSalaryConfig = async (req) => {
    const { configId } = req.params;
    const { 
        isEmployerEsi, isEmployerPf, pf, employerPF, esi, employerEsi, basic, hra, 
        conveyance, otherAllowance, sickLeave, casualLeave, permission, permissionDuration, 
        checkInTime, checkOutTime, graceTime, workingHours, approvedLate, startDeductFrom 
    } = req.body;

    // Check if salary config exists
    const existingSalaryConfig = await SalaryConfigModel.findById(configId);
    if (!existingSalaryConfig) {
        throw new ApiError(status.NOT_FOUND, "Salary config not found");
    }

    // Determine which fields have been modified
    const modifiedFields = [];
    if (existingSalaryConfig.isEmployerEsi !== isEmployerEsi) modifiedFields.push('isEmployerEsi');
    if (existingSalaryConfig.isEmployerPf !== isEmployerPf) modifiedFields.push('isEmployerPf');
    if (existingSalaryConfig.pf !== pf) modifiedFields.push('pf');
    if (existingSalaryConfig.employerPF !== employerPF) modifiedFields.push('employerPF');
    if (existingSalaryConfig.esi !== esi) modifiedFields.push('esi');
    if (existingSalaryConfig.employerEsi !== employerEsi) modifiedFields.push('employerEsi');
    if (existingSalaryConfig.basic !== basic) modifiedFields.push('basic');
    if (existingSalaryConfig.hra !== hra) modifiedFields.push('hra');
    if (existingSalaryConfig.conveyance !== conveyance) modifiedFields.push('conveyance');
    if (existingSalaryConfig.otherAllowance !== otherAllowance) modifiedFields.push('otherAllowance');
    if (existingSalaryConfig.sickLeave !== sickLeave) modifiedFields.push('sickLeave');
    if (existingSalaryConfig.casualLeave !== casualLeave) modifiedFields.push('casualLeave');
    if (existingSalaryConfig.permission !== permission) modifiedFields.push('permission');
    if (existingSalaryConfig.permissionDuration !== permissionDuration) modifiedFields.push('permissionDuration');
    if (existingSalaryConfig.checkInTime !== checkInTime) modifiedFields.push('checkInTime');
    if (existingSalaryConfig.checkOutTime !== checkOutTime) modifiedFields.push('checkOutTime');
    if (existingSalaryConfig.graceTime !== graceTime) modifiedFields.push('graceTime');
    if (existingSalaryConfig.workingHours !== workingHours) modifiedFields.push('workingHours');
    if (existingSalaryConfig.approvedLate !== approvedLate) modifiedFields.push('approvedLate');
    if (existingSalaryConfig.startDeductFrom !== startDeductFrom) modifiedFields.push('startDeductFrom');

    // Append the modification history with the modified fields
    const newHistoryEntry = getModifiedHistoryEntry("dummy_id",modifiedFields);
    
    // Update the salary config
    const updatedSalaryConfig = await SalaryConfigModel.findByIdAndUpdate(
        configId,
        { 
            isEmployerEsi, isEmployerPf, pf, employerPF, esi, employerEsi, basic, hra, 
            conveyance, otherAllowance, sickLeave, casualLeave, permission, permissionDuration, 
            checkInTime, checkOutTime, graceTime, workingHours, approvedLate, startDeductFrom,
            $push: { lastModified: newHistoryEntry }  // Add to the lastModified history
        },
        { new: true }
    );

    if (!updatedSalaryConfig) {
        throw new ApiError(status.INTERNAL_SERVER_ERROR, "Failed to update salary config");
    }

    return updatedSalaryConfig;
};

exports.deleteSalaryConfig = async (req) => {
    const { configId } = req.params;

    const deletedSalaryConfig = await SalaryConfigModel.findByIdAndDelete(configId);

    if (!deletedSalaryConfig) {
        throw new ApiError(status.NOT_FOUND, "Salary config not found or unable to delete");
    }

    return deletedSalaryConfig;
};
