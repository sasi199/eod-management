const { default: status } = require("http-status");
const ApiError = require("../utils/apiError");
const { MonthlyPayrollModel } = require("../models/monthlyPayroll.model");
const {
  getCurrentMonthYear,
  formatDate,
  getWorkingDays,
} = require("../utils/utils");
const { getData } = require("../config/json.config");

exports.createMonthlyPayroll = async (req) => {
  let { month, year, noOfWorkingDays, numberOfPaidHolydays,payDay } = req.body;

  let currentDate =new Date();

  if (!month || !year) {
    month = String(currentDate.getMonth()+1)
    year = currentDate.getFullYear()
  }

  // Adjust month to be zero-based
  const zeroBasedMonth = month - 1;

  currentDate = new Date(year, zeroBasedMonth, 1); // First day of the month
  const isoString = currentDate.toISOString();

  const formattedDateString = `${month}-${year}`;

  let { workingDays, holidays, startDate, endDate, payDate } = getWorkingDays(
    month, // Pass 1-based month
    year,
    payDay
  );

  startDate = formatDate(startDate); // Formats correctly
  endDate = formatDate(endDate);
  payDate = formatDate(payDate);

  const isExist = await MonthlyPayrollModel.exists({
    startDate,
    endDate,
  });

  if (isExist) {
    throw new ApiError(
      status.BAD_REQUEST,
      "This month's payroll has already been created"
    );
  }

  const dataToCreate = {
    dateString: formattedDateString,
    date: isoString,
    noOfWorkingDays: noOfWorkingDays??workingDays,
    numberOfPaidHolydays: numberOfPaidHolydays??holidays,
    startDate,
    endDate,
    payDate,
  };

  const newPayroll = await MonthlyPayrollModel.create(dataToCreate);

  if (!newPayroll) {
    throw new ApiError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to create monthly payroll"
    );
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
  let {
    noOfWorkingDays,
    numberOfPaidHolydays,
    payDay, // payDay just a date 7
  } = req.body;

  // Check if payroll exists
  const existingPayroll = await MonthlyPayrollModel.findById(payrollId);
  if (!existingPayroll) {
    throw new ApiError(status.NOT_FOUND, "Monthly payroll not found");
  }
  const startDateArray = existingPayroll.startDate.split('/')
  const zeroBasedMonth = parseInt(startDateArray[1])-1
  const year = parseInt(startDateArray[2])

  if(payDay){
    const date = new Date(year, zeroBasedMonth, parseInt(payDay));
    payDay = formatDate(date)
  }

  // Update the payroll
  const updatedPayroll = await MonthlyPayrollModel.findByIdAndUpdate(
    payrollId,
    {
      noOfWorkingDays,
      numberOfPaidHolydays,
      payDate:payDay,
    },
    { new: true }
  );

  if (!updatedPayroll) {
    throw new ApiError(
      status.INTERNAL_SERVER_ERROR,
      "Failed to update monthly payroll"
    );
  }

  return updatedPayroll;
};

exports.deleteMonthlyPayroll = async (req) => {
  const { payrollId } = req.params;

  const deletedPayroll = await MonthlyPayrollModel.findByIdAndDelete(payrollId);

  if (!deletedPayroll) {
    throw new ApiError(
      status.NOT_FOUND,
      "Monthly payroll not found or unable to delete"
    );
  }

  return deletedPayroll;
};
