const express = require('express');
const logger = require('../config/logger');
const salaryConfigController = require('../controller/salaryConfig.controller');

const salaryConfigRouter = express.Router();

// Logging middleware for salary config routes
salaryConfigRouter.use((req, res, next) => {
    logger.info("Salary Config route is being used");
    next();
});

// Route to create a new salary config
salaryConfigRouter.post('/create', salaryConfigController.createSalaryConfig);

// Route to get all salary configs
salaryConfigRouter.get('/get-all', salaryConfigController.getAllSalaryConfigs);

// Route to get a salary config by ID
salaryConfigRouter.get('/:configId', salaryConfigController.getSalaryConfigById);

// Route to update a salary config
salaryConfigRouter.put('/update/:configId', salaryConfigController.updateSalaryConfig);

// Route to delete a salary config
salaryConfigRouter.delete('/delete/:configId', salaryConfigController.deleteSalaryConfig);

module.exports = { path: '/salary-config', route: salaryConfigRouter };
