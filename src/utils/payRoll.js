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
    permission : 2,
    permissionDuration : 5400,
    _permissionDurationComment : "1.5 hour in seconds",
    checkInTime : "09:55",
    checkOutTime: "18:30",
    graceTime: 300,
    _graceTimeComment: "5min in seconds",
    workingHours: 270000,
    _workingHoursComment : "7.5 hours in seconds",
    approvedLate: 3,
    startDeductFrom : 4
  }
  

/**
 * Calculates the detailed salary breakdown based on gross salary.
 * @param {number} grossSalary - Total gross salary.
 * @param {boolean} includePF - Flag to include Provident Fund (default: true).
 * @param {boolean} includeESI - Flag to include Employee State Insurance (default: true).
 * @returns {object} An object containing success status and salary breakdown.
 */
const calculateSalaryBreakdown = (grossSalary, includePF = true, includeESI = true) => {
    // Validate input
    if (typeof grossSalary !== "number" || grossSalary <= 0) {
        throw new Error("Invalid gross salary. It must be a positive number.");
    }

    // Default basic salary as 40% of gross salary
    let basicSalary = grossSalary * 0.4;

    // Fetch salary division configuration
    const salaryConfig = getData();

    // Ensure all required keys exist in configuration
    const requiredKeys = ["basic", "pf", "esi", "hra", "otherAllowance", "conveyance"];
    for (const key of requiredKeys) {
        if (salaryConfig[key] === undefined) {
            // If keys are missing, return a default breakdown with partial calculation
            const salaryDetails = {
                basicSalary: basicSalary,
                providentFund: includePF ? basicSalary * 0.12 : 0,
                esi: includeESI ? basicSalary * 0.0075 : 0,
                houseRentAllowance: grossSalary * 0.3,
                otherAllowances: grossSalary * 0.2,
                conveyanceAllowance: grossSalary * 0.1,
            };
            return { success: false, salaryDetails };
        }
    }

    // Use configuration values to recalculate basic salary
    basicSalary = grossSalary * salaryConfig.basic;

    // Calculate salary components using the configuration
    const salaryDetails = {
        basicSalary: basicSalary,
        providentFund: includePF ? basicSalary * salaryConfig.pf : 0,
        esi: includeESI ? basicSalary * salaryConfig.esi : 0,
        houseRentAllowance: grossSalary * salaryConfig.hra,
        otherAllowances: grossSalary * salaryConfig.otherAllowance,
        conveyanceAllowance: grossSalary * salaryConfig.conveyance,
    };

    return { success: true, salaryDetails };
};

const calculateNumberOfWorkingDays = (totalWorkingDays,unapprovedLeavesTaken, leavesTaken, permissionsTaken, numberOfLates, balanceLeaves, isSandwichAllowed=false)=>{
    let salaryWorkingDays = totalWorkingDays-unapprovedLeavesTaken;

    const salaryConfig = getData();

    let approvedLeaves = salaryConfig.sickLeave +salaryConfig.casualLeave + balanceLeaves;
    if(leavesTaken > approvedLeaves){
        salaryWorkingDays -= (leavesTaken - approvedLeaves - balanceLeaves);
    }
}


module.exports = {calculateSalaryBreakdown}