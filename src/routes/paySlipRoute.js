const express = require('express');
const logger = require('../config/logger');
const PayslipController = require('../controller/paySlip.controller');

const PaySlipRouter = express.Router();

// Logging middleware for monthly payroll routes
PaySlipRouter.use((req, res, next) => {
    logger.info("Pay slip route is being used");
    next();
});

// Route to create a new monthly payroll
// PaySlipRouter.post('/create', PayslipController.createMonthlyPayroll);

// Route to get all monthly payrolls
PaySlipRouter.get('/get-all', PayslipController.getAllPayrolls);

// Route to get a monthly payroll by ID
// PaySlipRouter.get('/:payrollId', PayslipController.getMonthlyPayrollById);

// Route to update a monthly payroll
// PaySlipRouter.put('/update/:payrollId', PayslipController.updateMonthlyPayroll);

// Route to delete a monthly payroll
// PaySlipRouter.delete('/delete/:payrollId', PayslipController.deleteMonthlyPayroll);

module.exports = { path: '/pay-slip', route: PaySlipRouter };
