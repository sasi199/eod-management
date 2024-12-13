const SalaryConfigService = require('../services/salaryConfig.services');
const catchAsync = require('../utils/catchAsync');

// Create a new salary config
exports.createSalaryConfig = catchAsync(async (req, res) => {
    const response = await SalaryConfigService.createSalaryConfig(req);

    res.status(201).json({ success: true, message: "Salary config created successfully", data: response });
});

// Get all salary configs
exports.getAllSalaryConfigs = catchAsync(async (req, res) => {
    const response = await SalaryConfigService.getAllSalaryConfigs();

    res.status(200).json({ success: true, message: "Salary configs fetched successfully", data: response });
});

// Get salary configs
exports.getSalaryConfigs = catchAsync(async (req, res) => {
    const response = await SalaryConfigService.getAllSalaryConfigs();

    res.status(200).json({ success: true, message: "Salary config fetched successfully", data: response[0] });
});

// Get a salary config by ID
exports.getSalaryConfigById = catchAsync(async (req, res) => {
    const response = await SalaryConfigService.getSalaryConfigById(req);

    res.status(200).json({ success: true, message: "Salary config fetched successfully", data: response });
});

// Update a salary config
exports.updateSalaryConfig = catchAsync(async (req, res) => {
    const response = await SalaryConfigService.updateSalaryConfig(req);

    res.status(200).json({ success: true, message: "Salary config updated successfully", data: response });
});

// Delete a salary config
exports.deleteSalaryConfig = catchAsync(async (req, res) => {
    const response = await SalaryConfigService.deleteSalaryConfig(req);

    res.status(200).json({ success: true, message: "Salary config deleted successfully" });
});
