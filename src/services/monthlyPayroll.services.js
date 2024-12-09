const { default: status } = require("http-status");
const ApiError = require("../utils/apiError");
const { MonthlyPayrollModel } = require("../models/monthlyPayroll.model");
const { getCurrentMonthYear, formatDate, getWorkingDays } = require("../utils/utils");
const { getData } = require("../config/json.config");

exports.createMonthlyPayroll = async (req) => {
    let {month, year} = req.body;

    if(!month || !year){
        ({ month, year } = getCurrentMonthYear());
    }

    const {startDate,endDate} = getWorkingDays(month,year);
    
    const isExist = await MonthlyPayrollModel.exists({startDate:formatDate(startDate),endDate:formatDate(endDate)});

    if(isExist){
        throw new ApiError(status.BAD_REQUEST, "This months payroll has already been created")
    }

    const newPayroll = await MonthlyPayrollModel.create({});

    if (!newPayroll) {
        throw new ApiError(status.INTERNAL_SERVER_ERROR, "Failed to create monthly payroll");
    }

    return newPayroll;
};

exports.getAllMonthlyPayrolls = async () => {
    const payrolls = await MonthlyPayrollModel.find();

    if (payrolls.length < 1) {
        throw new ApiError(status.NOT_FOUND, "No monthly payrolls found");
    }

    return payrolls;
};

exports.getMonthlyPayrollById = async (req) => {
    const { payrollId } = req.params;

    const payroll = await MonthlyPayrollModel.findById(payrollId);

    if (!payroll) {
        throw new ApiError(status.NOT_FOUND, "Monthly payroll not found");
    }

    return payroll;
};

exports.updateMonthlyPayroll = async (req) => {
    const { payrollId } = req.params;
    const { dateString, date, noOfWorkingDays, numberOfPaidHolydays, startDate, endDate, payDate } = req.body;

    // Check if payroll exists
    const existingPayroll = await MonthlyPayrollModel.findById(payrollId);
    if (!existingPayroll) {
        throw new ApiError(status.NOT_FOUND, "Monthly payroll not found");
    }

    // Update the payroll
    const updatedPayroll = await MonthlyPayrollModel.findByIdAndUpdate(
        payrollId,
        { dateString, date, noOfWorkingDays, numberOfPaidHolydays, startDate, endDate, payDate },
        { new: true }
    );

    if (!updatedPayroll) {
        throw new ApiError(status.INTERNAL_SERVER_ERROR, "Failed to update monthly payroll");
    }

    return updatedPayroll;
};

exports.deleteMonthlyPayroll = async (req) => {
    const { payrollId } = req.params;

    const deletedPayroll = await MonthlyPayrollModel.findByIdAndDelete(payrollId);

    if (!deletedPayroll) {
        throw new ApiError(status.NOT_FOUND, "Monthly payroll not found or unable to delete");
    }

    return deletedPayroll;
};
