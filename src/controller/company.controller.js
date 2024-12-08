const CompanyService = require('../services/company.services');
const catchAsync = require('../utils/catchAsync');

// Create a new company
exports.createCompany = catchAsync(async (req, res) => {
    const response = await CompanyService.createCompany(req);

    res.status(201).json({ success: true, message: "Company created successfully", data: response });
});

// Get all companies
exports.getAllCompanies = catchAsync(async (req, res) => {
    const response = await CompanyService.getAllCompanies(req);

    res.status(200).json({ success: true, message: "Companies fetched successfully", data: response });
});

// Get a company by ID
exports.getCompanyById = catchAsync(async (req, res) => {
    const response = await CompanyService.getCompanyById(req);

    res.status(200).json({ success: true, message: "Company fetched successfully", data: response });
});

// Update a company
exports.updateCompany = catchAsync(async (req, res) => {
    const response = await CompanyService.updateCompany(req);

    res.status(200).json({ success: true, message: "Company updated successfully", data: response });
});

// Delete a company
exports.deleteCompany = catchAsync(async (req, res) => {
    const response = await CompanyService.deleteCompany(req);

    res.status(200).json({ success: true, message: "Company deleted successfully" });
});
