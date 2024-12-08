const { default: status } = require("http-status");
const ApiError = require("../utils/apiError");
const { PayrollModel } = require("../models/payroll.model");
const StaffModel = require("../models/staffModel");

// Create Payroll
exports.createPayroll = async (req) => {
    const { ...dataToCreate } = req.body;

    // Check for required `staff_id`
    if (!dataToCreate.staff_id) {
        throw new ApiError(status.BAD_REQUEST, "Staff ID is required to create payroll.");
    }

    // Check if the staff exists
    const isStaffExist = await StaffModel.exists({ _id: dataToCreate.staff_id });
    if (!isStaffExist) {
        throw new ApiError(status.NOT_FOUND, "Invalid staff ID. Staff not found.");
    }

    // Create Payroll Entry
    const createdPayroll = await PayrollModel.create(dataToCreate);

    if (!createdPayroll) {
        throw new ApiError(status.INTERNAL_SERVER_ERROR, "Failed to create payroll entry.");
    }

    return createdPayroll;
};

// Get All Payrolls
exports.getAllPayrolls = async () => {
    console.log(PayrollModel,"PayrollModel")
    const payrolls = await PayrollModel.find().populate("staff_id", "name email");

    if (payrolls.length < 1) {
        throw new ApiError(status.NOT_FOUND, "No payroll records found.");
    }

    return payrolls;
};

// Get Payroll by ID
exports.getPayrollById = async (req) => {
    const { payrollId } = req.params;

    const payroll = await PayrollModel.findById(payrollId).populate("staff_id", "name email");

    if (!payroll) {
        throw new ApiError(status.NOT_FOUND, "Payroll entry not found.");
    }

    return payroll;
};

// Update Payroll
exports.updatePayroll = async (req) => {
    const { payrollId } = req.params;
    const { ...dataToUpdate } = req.body;

    const updatedPayroll = await PayrollModel.findByIdAndUpdate(payrollId, dataToUpdate, { new: true });

    if (!updatedPayroll) {
        throw new ApiError(status.NOT_FOUND, "Payroll entry not found or update failed.");
    }

    return updatedPayroll;
};

// Delete Payroll
exports.deletePayroll = async (req) => {
    const { payrollId } = req.params;

    const deletedPayroll = await PayrollModel.findByIdAndDelete(payrollId);

    if (!deletedPayroll) {
        throw new ApiError(status.NOT_FOUND, "Failed to delete payroll entry. Payroll not found.");
    }

    return deletedPayroll;
};
