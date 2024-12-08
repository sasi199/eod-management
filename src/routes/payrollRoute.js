const express = require("express");
const logger = require("../config/logger");
const payrollController = require("../controller/payroll.controller");

const payrollRouter = express.Router();

// Middleware to log route usage
payrollRouter.use((req, res, next) => {
    logger.info("Payroll route is being used");
    next();
});

// Define routes for Payroll
payrollRouter.post("/create", payrollController.createPayroll);

payrollRouter.get("/get-all", payrollController.getAllPayrolls);

payrollRouter.get("/:payroll_id", payrollController.getPayrollById);

payrollRouter.put("/update/:payroll_id", payrollController.updatePayroll);

payrollRouter.delete("/delete-h/:payroll_id", payrollController.deletePayroll);

// Export the route
module.exports = { path: "/payroll", route: payrollRouter };
