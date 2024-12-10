const { getData } = require("../config/json.config");

const standardSalaryConfig = {
  pf: 0.12,
  esi: 0.0075,
  basic: 0.4,
  hra: 0.3,
  conveyance: 0.1,
  otherAllowance: 0.2,
  sickLeave: 1,
  casualLeave: 1,
  permission: 2,
  permissionDuration: 5400,
  _permissionDurationComment: "1.5 hours in seconds",
  checkInTime: "09:55",
  checkOutTime: "18:30",
  graceTime: 300,
  _graceTimeComment: "5 minutes in seconds",
  workingHours: 270000,
  _workingHoursComment: "7.5 hours in seconds",
  approvedLate: 3,
  startDeductFrom: 4,
};

/**
 * Calculates the salary breakdown from the gross salary.
 * @param {number} grossSalary - Total gross salary.
 * @param {number} totalWorkingDays - Total working days.
 * @param {number} lopDays - Total loss of pay.
 * @param {boolean} includePF - Flag to include Provident Fund (default: true).
 * @param {boolean} includeESI - Flag to include Employee State Insurance (default: true).
 * @returns {object} An object containing success status and salary breakdown.
 */
const calculateSalaryBreakdown = (
  grossSalary,
  totalWorkingDays,
  lopDays = 0,
  includePF = true,
  includeESI = true
) => {

  let success = true;

  if (typeof grossSalary !== "number" || grossSalary <= 0) {
    throw new Error("Invalid gross salary. It must be a positive number.");
  }

  if (typeof lopDays !== "number" || lopDays < 0) {
    throw new Error("Invalid LOP days. It must be a non-negative number.");
  }

  // Load salary configuration or use defaults
  let salaryConfig = getData();
  const requiredKeys = [
    "basic",
    "pf",
    "esi",
    "hra",
    "otherAllowance",
    "conveyance",
  ];

  // Validate required keys, fallback to standardSalaryConfig if incomplete
  const hasAllKeys = requiredKeys.every(
    (key) => salaryConfig[key] !== undefined
  );
  if (!hasAllKeys) {
    salaryConfig = standardSalaryConfig; // Fallback to defaults
    success = false;
  }

  // Calculate LOP deduction based on gross salary
  const lopDeduction = (grossSalary / totalWorkingDays) * lopDays;

  
  // Adjust gross salary after LOP deduction
  const adjustedGrossSalary = grossSalary - lopDeduction;
  
  // Basic salary calculation
  let basicSalary = adjustedGrossSalary * salaryConfig.basic;

  // Calculate Provident Fund and ESI on adjusted gross salary
  let providentFund = includePF ? basicSalary * salaryConfig.pf : 0;
  let esi = includeESI ? basicSalary * salaryConfig.esi : 0;

  // Other salary components
  let houseRentAllowance = adjustedGrossSalary * salaryConfig.hra;
  let conveyance = adjustedGrossSalary * salaryConfig.conveyance;

  // Calculate other allowances to ensure total matches adjusted gross salary
  let otherAllowances =
    adjustedGrossSalary - (basicSalary + houseRentAllowance + conveyance);

  // Total deductions (PF + ESI)
  const pfAndEsiDeduction = providentFund + esi;

  // Gross earned after LOP and deductions
  const grossEarned = adjustedGrossSalary - pfAndEsiDeduction;

  // Round all values to 1 decimal place
  const salaryDetails = {
    basic: Math.round(basicSalary * 10) / 10,
    epfContribution: Math.round(providentFund * 10) / 10,
    esiContribution: Math.round(esi * 10) / 10,
    hra: Math.round(houseRentAllowance * 10) / 10,
    conveyance: Math.round(conveyance * 10) / 10,
    otherAllowance: Math.round(otherAllowances * 10) / 10,
    lopDeduction: Math.round(lopDeduction * 10) / 10,
    pfAndEsiDeduction: Math.round(pfAndEsiDeduction * 10) / 10,
    grossEarnings: Math.round(grossEarned * 10) / 10,
    totalDeductions: Math.round(pfAndEsiDeduction * 10) / 10 + + Math.round(lopDeduction * 10) / 10,
    professionalTax: 0,
    totalNetPay:  Math.round(grossEarned * 10) / 10,
  };

  return { success, salaryDetails };
};

/**
 * Calculates the remaining late balance and the deduction amount.
 * @param {number} lateCount - Number of late arrivals.
 * @param {number} deductionLimit - The maximum number of hours to deduct.
 * @returns {Array} An array with the remaining late balance and deduction.
 */
const calculateLateBalance = (lateCount, deductionLimit) => {
  let remainingLate = lateCount;
  let remainingDeduction = deductionLimit;

  if (remainingLate > 0 && remainingDeduction > 0) {
    const tempLate = remainingLate;
    remainingLate = Math.max(0, remainingLate - remainingDeduction);
    remainingDeduction = Math.max(0, remainingDeduction - tempLate);
  }

  return [remainingLate, remainingDeduction];
};

/**
 * Calculates the balance of leaves taken and remaining.
 * @param {number} leavesTaken - Number of approved leaves taken.
 * @param {number} leaveBalance - Current leave balance.
 * @param {number} carryForwardLeaves - The number of carry forward leave days.
 * @returns {Array} An array with the number of leaves taken and updated balances.
 */
const calculateLeaveBalance = (
  leavesTaken,
  leaveBalance,
  carryForwardLeaves = null
) => {
  let remainingLeaveBalance = leaveBalance;
  let carryForwardLeaveBalance = carryForwardLeaves;

  if (leavesTaken >= remainingLeaveBalance) {
    leavesTaken -= remainingLeaveBalance;
    remainingLeaveBalance = 0;
  } else {
    remainingLeaveBalance -= leavesTaken;
    leavesTaken = 0;
  }

  if (carryForwardLeaveBalance !== null) {
    carryForwardLeaveBalance += remainingLeaveBalance;
  }

  return carryForwardLeaveBalance !== null
    ? [leavesTaken, remainingLeaveBalance, carryForwardLeaveBalance]
    : [leavesTaken, remainingLeaveBalance];
};

/**
 * Calculates the number of working days considering leave balances, late deductions, and other factors.
 * @param {Object} params - The input parameters.
 * @param {number} params.totalWorkingDays - Total number of working days in the month.
 * @param {number} params.unapprovedLeavesTaken - Number of unapproved leaves taken.
 * @param {number} params.approvedLeavesTaken - Number of approved leaves taken.
 * @param {number} params.permissionsTaken - Number of permissions taken.
 * @param {number} params.lateCount - Number of late arrivals.
 * @param {number} params.leaveBalance - The balance of leaves.
 * @param {number} params.compOffDays - The number of compensatory off days.
 * @param {object} config - Optional custom salary configuration (default: standardSalaryConfig).
 * @returns {Object} An object containing the calculated working days and leave balances.
 */
const calculateWorkingDays = ({
  totalWorkingDays,
  unapprovedLeavesTaken,
  approvedLeavesTaken,
  permissionsTaken,
  lateCount,
  leaveBalance,
  compOffDays,
}) => {
  let effectiveWorkingDays = totalWorkingDays - unapprovedLeavesTaken;

  let salaryConfig = getData();

  const requiredKeys = ["sickLeave", "sickLeave", "permission", "approvedLate"];
  for (const key of requiredKeys) {
    if (salaryConfig[key] === undefined) {
      salaryConfig = standardSalaryConfig;
      break;
    }
  }

  let sickLeaveBalance = salaryConfig.sickLeave;
  let casualLeaveBalance = salaryConfig.casualLeave;
  let compOffBalance = compOffDays;
  let carryForwardLeaveBalance = leaveBalance;
  let approvedLeavesUsed = approvedLeavesTaken;
  let permissionBalance = Math.max(
    0,
    salaryConfig.permission - permissionsTaken
  );
  let lateBalance = Math.max(0, lateCount - salaryConfig.approvedLate);

  // Calculate balances for late, casual, sick leaves, and permissions
  [lateBalance, permissionBalance] = calculateLateBalance(
    lateBalance,
    permissionBalance
  );
  [lateBalance, casualLeaveBalance] = calculateLateBalance(
    lateBalance,
    casualLeaveBalance
  );
  [lateBalance, sickLeaveBalance] = calculateLateBalance(
    lateBalance,
    sickLeaveBalance
  );

  // Calculate balances for approved leaves and carry forward leaves
  [approvedLeavesUsed, casualLeaveBalance] = calculateLeaveBalance(
    approvedLeavesUsed,
    casualLeaveBalance
  );
  [approvedLeavesUsed, sickLeaveBalance, carryForwardLeaveBalance] =
    calculateLeaveBalance(
      approvedLeavesUsed,
      sickLeaveBalance,
      carryForwardLeaveBalance
    );
  [approvedLeavesUsed, compOffBalance] = calculateLeaveBalance(
    approvedLeavesUsed,
    compOffBalance
  );
  [approvedLeavesUsed, carryForwardLeaveBalance] = calculateLeaveBalance(
    approvedLeavesUsed,
    carryForwardLeaveBalance
  );

  if (lateBalance > 0) {
    const deductionDays = lateBalance * 0.5;
    effectiveWorkingDays -= deductionDays;
    lateBalance = 0;
  }

  let lopDays = totalWorkingDays - effectiveWorkingDays;

  return {
    casualLeaveAvailable: salaryConfig.casualLeave,
    casualLeaveUsed: salaryConfig.casualLeave - casualLeaveBalance,
    casualLeaveBalance,
    sickLeaveAvailable: salaryConfig.sickLeave,
    sickLeaveUsed: salaryConfig.sickLeave - sickLeaveBalance,
    sickLeaveBalance,
    balanceLeaveAvailable: leaveBalance,
    balanceLeaveUsed: leaveBalance - carryForwardLeaveBalance,
    balanceLeaveBalance: carryForwardLeaveBalance,
    balanceLeave:carryForwardLeaveBalance,
    compOffAvailable: compOffDays,
    compOffUsed: compOffDays - compOffBalance,
    compOffBalance: compOffBalance,
    totalLeaveBalance: carryForwardLeaveBalance,
    paidDays: totalWorkingDays,
    lopDays,
    effectiveWorkingDays,
  };
};

// Example usage of `calculateWorkingDays`
// const workingDaysData = calculateWorkingDays({
//   totalWorkingDays: 30,
//   unapprovedLeavesTaken: 1,
//   approvedLeavesTaken: 1,
//   permissionsTaken: 1,
//   lateCount: 23,
//   leaveBalance: 0,
//   compOffDays: 2,
// });

// console.log(workingDaysData, "leave data");

module.exports = { calculateSalaryBreakdown, calculateWorkingDays };
