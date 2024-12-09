const { default: status } = require("http-status");
const { PayrollModel } = require("../models/payroll.model");
const { PaySlipModel } = require("../models/paySlip.model");
const StaffModel = require("../models/staffModel");
const ApiError = require("../utils/apiError");
const { MONTHS, formatDate, getWorkingDays, numberToWords } = require("../utils/utils");
const { MonthlyPayrollModel } = require("../models/monthlyPayroll.model");
const AttendanceModel = require("../models/attendance");
const { calculateWorkingDays, calculateSalaryBreakdown } = require("../utils/payRoll");
const { CompanyModel } = require("../models/company.model");


const getAttendanceDetails = (attendances) => {
  let unapprovedLeavesTaken = 0;
  let approvedLeavesTaken = 0;
  let permissionsTaken = 0;
  let lateCount = 0;
  let compOffDays = 0;
  for (let attendance of attendances) {
    const { status } = attendance;
    if (status === "Late") {
      lateCount++;
      continue;
    }
    if (status === "Absent") {
      approvedLeavesTaken++;
    }
  }
  return {
    unapprovedLeavesTaken,
    approvedLeavesTaken,
    permissionsTaken,
    lateCount,
    compOffDays,
  };
};

exports.getStaffPaySlip = async (req) => {
  const { sid, m, y } = req.query;

  console.log(sid, "sid");
  const { workingDays, holidays, startDate, endDate, payDate } = getWorkingDays(
    parseInt(m),
    parseInt(y)
  );

  formattedStartDate = formatDate(startDate);
  formattedEndDate = formatDate(endDate);
  formattedPayDate = formatDate(payDate);

  const startIsoString = startDate.toISOString();
  const endIsoString = endDate.toISOString();

  const paySlipMonth = `${MONTHS[m - 1]} ${y}`;

  const getStaffQuery = StaffModel.findById(sid).populate({
    path: 'designation',
    select: 'title'
  }).populate({
    path: 'department_id',
    select: 'name'
  });
  const getPayRollQuery = PayrollModel.findOne({ staff_id: sid });
  const getMonthlyPayrollQuery = MonthlyPayrollModel.findOne({
    startDate: formattedStartDate,
    endDate: formattedEndDate,
  });
  const getAttendanceQuery = AttendanceModel.find({
    user: sid,
    date: {
      $gte: startIsoString,
      $lte: endIsoString,
    },
  });

  console.log(formattedStartDate, formattedEndDate, "sdsdsd");
  const [staffDetails, payrollDetails, monthlyPayroll, staffAttendance] =
    await Promise.all([
      getStaffQuery,
      getPayRollQuery,
      getMonthlyPayrollQuery,
      getAttendanceQuery,
    ]);

    const companyData = await CompanyModel.findById(staffDetails.company_id);

  let {
    unapprovedLeavesTaken,
    approvedLeavesTaken,
    permissionsTaken,
    lateCount,
    compOffDays
  } = getAttendanceDetails(staffAttendance);

  let totalWorkingDays = monthlyPayroll.noOfWorkingDays;

  let leaveBalance = 0;

  data = calculateWorkingDays({
    totalWorkingDays,
    unapprovedLeavesTaken,
    approvedLeavesTaken,
    permissionsTaken,
    lateCount,
    leaveBalance,
    compOffDays,
  });


  const {grossSalary} = payrollDetails;

  const earnedGrossSalary = data.effectiveWorkingDays * (grossSalary/data.totalWorkingDays);

  const {salaryDetails} = calculateSalaryBreakdown(earnedGrossSalary);

  const paySlipData = {
    colorCode: companyData.colorCode ?? "#531d6b",
    companyLogo: companyData.companyLogo ?? 'https://facesync.app/wp-content/uploads/2024/02/FaceSync-white-background-02-1024x503.png', // Path to your logo
    companyName: companyData.companyName??'Facesync',
    companyLocation: companyData.address??'Chennai, India',
    paySlipMonth,
    employeeName: staffDetails.fullName ?? 'Syed Abuthahir',
    designation: staffDetails.designation.title,
    employeeId: staffDetails.staffId,
    department: staffDetails.department_id.name,
    dateOfJoining: staffDetails.doj,
    payDate: monthlyPayroll.payDate,
    pfAccountNumber: payrollDetails.pfNumber,
    uan: payrollDetails.uanNumber,
    casualLeaveAvailable: 1,
    casualLeaveUsed: 1-data.casualLeaveBalance,
    casualLeaveBalance: data.casualLeaveBalance,
    sickLeaveAvailable: 1,
    sickLeaveUsed: 1-data.sickLeaveBalance,
    sickLeaveBalance: data.sickLeaveBalance,
    balanceLeaveAvailable: leaveBalance,
    balanceLeaveUsed: leaveBalance-data.balanceLeaveAvailable,
    balanceLeaveBalance: data.balanceLeaveAvailable,
    compOffAvailable: compOffDays,
    compOffUsed: compOffDays-data.compOffBalance,
    compOffBalance: data.compOffBalance,
    totalLeaveBalance: data.carryForwardLeaveBalance,
    netPay: `₹${payrollDetails.grossSalary}`,
    paidDays: data.totalWorkingDays,
    lopDays: data.totalWorkingDays-data.effectiveWorkingDays,
    balanceLeave: data.carryForwardLeaveBalance,
    basic: `₹${salaryDetails.basicSalary}`,
    hra: `₹${salaryDetails.houseRentAllowance}`,
    conveyance: `₹${salaryDetails.conveyance}`,
    fixedAllowance: `₹${salaryDetails.otherAllowances}`,
    grossEarnings: `₹${earnedGrossSalary}`,
    epfContribution: `₹${salaryDetails.providentFund}`,
    professionalTax: '₹0',
    lopDeduction: `₹${(data.totalWorkingDays-data.effectiveWorkingDays)*(grossSalary/data.totalWorkingDays)}`,
    totalDeductions: `₹${grossSalary-earnedGrossSalary}`,
    totalNetPay: `₹${earnedGrossSalary}`,
    amountInWords: numberToWords(earnedGrossSalary),
  };

  return paySlipData;
};
