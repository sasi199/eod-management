const express = require('express');
const logger = require('../config/logger');
const monthlyPayrollController = require('../controller/monthlyPayroll.controller');

const monthlyPayrollRouter = express.Router();

// Logging middleware for monthly payroll routes
monthlyPayrollRouter.use((req, res, next) => {
    logger.info("Monthly Payroll route is being used");
    next();
});

// Route to create a new monthly payroll
monthlyPayrollRouter.post('/create', monthlyPayrollController.createMonthlyPayroll);

// Route to get all monthly payrolls
monthlyPayrollRouter.get('/get-all', monthlyPayrollController.getAllMonthlyPayrolls);

// Route to get a monthly payroll by ID
monthlyPayrollRouter.get('/:payrollId', monthlyPayrollController.getMonthlyPayrollById);

// Route to update a monthly payroll
monthlyPayrollRouter.put('/update/:payrollId', monthlyPayrollController.updateMonthlyPayroll);

// Route to delete a monthly payroll
monthlyPayrollRouter.delete('/delete/:payrollId', monthlyPayrollController.deleteMonthlyPayroll);

module.exports = { path: '/monthly-payroll', route: monthlyPayrollRouter };
