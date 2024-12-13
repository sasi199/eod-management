const MonthlyPayrollService = require('../services/monthlyPayroll.services');
const catchAsync = require('../utils/catchAsync');

// Create a new monthly payroll
exports.createMonthlyPayroll = catchAsync(async (req, res) => {
    const response = await MonthlyPayrollService.createMonthlyPayroll(req);

    res.status(201).json({ success: true, message: "Monthly payroll created successfully", data: response });
});

// Get all monthly payrolls
exports.getAllMonthlyPayrolls = catchAsync(async (req, res) => {
    const response = await MonthlyPayrollService.getAllMonthlyPayrolls();

    res.status(200).json({ success: true, message: "Monthly payrolls fetched successfully", data: response });
});

// Get a monthly payroll by ID
exports.getMonthlyPayrollById = catchAsync(async (req, res) => {
    const response = await MonthlyPayrollService.getMonthlyPayrollById(req);

    res.status(200).json({ success: true, message: "Monthly payroll fetched successfully", data: response });
});

// Update a monthly payroll
exports.updateMonthlyPayroll = catchAsync(async (req, res) => {
    const response = await MonthlyPayrollService.updateMonthlyPayroll(req);

    res.status(200).json({ success: true, message: "Monthly payroll updated successfully", data: response });
});

// Delete a monthly payroll
exports.deleteMonthlyPayroll = catchAsync(async (req, res) => {
    const response = await MonthlyPayrollService.deleteMonthlyPayroll(req);

    res.status(200).json({ success: true, message: "Monthly payroll deleted successfully" });
});
