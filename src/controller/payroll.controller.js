const PayrollService = require("../services/payroll.services");
const catchAsync = require("../utils/catchAsync");

// Create Payroll
exports.createPayroll = catchAsync(async (req, res) => {
    const response = await PayrollService.createPayroll(req);
    res.status(201).json({ success: true, message: "Payroll created successfully", data: response });
});

// Get All Payrolls
exports.getAllPayrolls = catchAsync(async (req, res) => {
    const response = await PayrollService.getAllPayrolls();
    res.status(200).json({ success: true, message: "Payroll records fetched successfully", data: response });
});

// Get Payroll By ID
exports.getPayrollById = catchAsync(async (req, res) => {
    const response = await PayrollService.getPayrollById(req);
    res.status(200).json({ success: true, message: "Payroll record fetched successfully", data: response });
});

// Update Payroll
exports.updatePayroll = catchAsync(async (req, res) => {
    const response = await PayrollService.updatePayroll(req);
    res.status(200).json({ success: true, message: "Payroll updated successfully", data: response });
});

// Delete Payroll
exports.deletePayroll = catchAsync(async (req, res) => {
    await PayrollService.deletePayroll(req);
    res.status(200).json({ success: true, message: "Payroll deleted successfully" });
});
