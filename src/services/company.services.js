const { default: status } = require("http-status");
const ApiError = require("../utils/apiError");
const { CompanyModel } = require("../models/company.model");

exports.createCompany = async (req) => {
    const { companyName, companyCode, address, contactNumber, website } = req.body;

    // Validation checks
    if (!companyName) {
        throw new ApiError(status.BAD_REQUEST, "Company name is required");
    }

    if (!companyCode) {
        throw new ApiError(status.BAD_REQUEST, "Company code is required");
    }

    // Check if the companyCode is already used
    const existingCompany = await CompanyModel.exists({ companyCode });
    if (existingCompany) {
        throw new ApiError(status.BAD_REQUEST, "Company code already exists");
    }

    // Create the company
    const newCompany = await CompanyModel.create({
        companyName,
        companyCode,
        address: address || "Not provided", 
        contactNumber: contactNumber || "Not provided",
        website: website || "http://example.com",
    });

    if (!newCompany) {
        throw new ApiError(status.INTERNAL_SERVER_ERROR, "Failed to create company");
    }

    return newCompany;
};

exports.getAllCompanies = async (req) => {
    const companies = await CompanyModel.find();

    if (companies.length < 1) {
        throw new ApiError(status.NOT_FOUND, "No companies found");
    }

    return companies;
};

exports.getCompanyById = async (req) => {
    const { companyId } = req.params;

    const company = await CompanyModel.findById(companyId);

    if (!company) {
        throw new ApiError(status.NOT_FOUND, "Company not found");
    }

    return company;
};

exports.updateCompany = async (req) => {
    const { companyId } = req.params;
    const { companyName, companyCode, address, contactNumber, website } = req.body;

    // Check if company exists
    const existingCompany = await CompanyModel.findById(companyId);
    if (!existingCompany) {
        throw new ApiError(status.NOT_FOUND, "Company not found");
    }

    // Check if companyCode is being updated and if it already exists
    if (companyCode && companyCode !== existingCompany.companyCode) {
        const companyWithCode = await CompanyModel.findOne({ companyCode });
        if (companyWithCode) {
            throw new ApiError(status.BAD_REQUEST, "Company code already exists");
        }
    }

    // Update the company
    const updatedCompany = await CompanyModel.findByIdAndUpdate(
        companyId,
        { companyName, companyCode, address, contactNumber, website },
        { new: true }
    );

    if (!updatedCompany) {
        throw new ApiError(status.INTERNAL_SERVER_ERROR, "Failed to update company");
    }

    return updatedCompany;
};

exports.deleteCompany = async (req) => {
    const { companyId } = req.params;

    const deletedCompany = await CompanyModel.findByIdAndDelete(companyId);

    if (!deletedCompany) {
        throw new ApiError(status.NOT_FOUND, "Company not found or unable to delete");
    }

    return deletedCompany;
};
