const express = require('express');
const logger = require('../config/logger');
const companyController = require('../controller/company.controller');

const companyRouter = express.Router();

// Logging middleware for company routes
companyRouter.use((req, res, next) => {
    logger.info("Company route is being used");
    next();
});

// Route to create a new company
companyRouter.post('/create', companyController.createCompany);

// Route to get all companies
companyRouter.get('/get-all', companyController.getAllCompanies);

// Route to get a company by ID
companyRouter.get('/:companyId', companyController.getCompanyById);

// Route to update a company
companyRouter.put('/update/:companyId', companyController.updateCompany);

// Route to delete a company
companyRouter.delete('/delete-h/:companyId', companyController.deleteCompany);

module.exports = { path: '/company', route: companyRouter };
