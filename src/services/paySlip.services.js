const { default: status } = require("http-status");
const { PayrollModel } = require("../models/payRoll.model");
const { PaySlipModel } = require("../models/paySlip.model");
const StaffModel = require("../models/staffModel");
const ApiError = require("../utils/apiError");
const {
  MONTHS,
  formatDate,
  getWorkingDays,
  numberToWords,
} = require("../utils/utils");
const { MonthlyPayrollModel } = require("../models/monthlyPayroll.model");
const AttendanceModel = require("../models/attendance");
const {
  calculateWorkingDays,
  calculateSalaryBreakdown,
} = require("../utils/payRoll");
const { CompanyModel } = require("../models/company.model");
const TraineeModel = require("../models/traineeModel");

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

const getPaySlipData = async (query) => {
  const { sid, tid, m, y } = query; // sid - staff_id, tid - trainee_id, m - month (1,2,...12), y - year (2023,2024)
    console.log(query,"sd")
  if ((!sid && !tid) || !m || !y) {
    console.log("no proper data")
    return null;
  }

  let isTrainee = false;
  if (!sid && tid) {
    isTrainee = true;
  }

  console.log(isTrainee,"isTrainee")
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

  let getUserQuery = null;
  let getPayRollQuery = null;
  let getMonthlyPayrollQuery = null;
  let getAttendanceQuery = null;

  if (!isTrainee) {
    getUserQuery = StaffModel.findById(sid)
      .populate({
        path: "designation",
        select: "title",
      })
      .populate({
        path: "department_id",
        select: "name",
      });
    getPayRollQuery = PayrollModel.findOne({ user_id: sid });
    getMonthlyPayrollQuery = MonthlyPayrollModel.findOne({
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
    getAttendanceQuery = AttendanceModel.find({
      user: sid,
      date: {
        $gte: startIsoString,
        $lte: endIsoString,
      },
    });
  }else{
    getUserQuery = TraineeModel.findById(tid);
    getPayRollQuery = PayrollModel.findOne({ user_id: tid });
    getMonthlyPayrollQuery = MonthlyPayrollModel.findOne({
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    });
    getAttendanceQuery = AttendanceModel.find({
      user: tid,
      date: {
        $gte: startIsoString,
        $lte: endIsoString,
      },
    });
  }


  const [userDetails, payrollDetails, monthlyPayroll, staffAttendance] =
    await Promise.all([
      getUserQuery,
      getPayRollQuery,
      getMonthlyPayrollQuery,
      getAttendanceQuery,
    ]);

  if (!userDetails || !payrollDetails || !monthlyPayroll || !staffAttendance) {
    console.log({userDetails, payrollDetails, monthlyPayroll, staffAttendance})
    console.log("error in getting data")
    return null;
  }

  const companyData = await CompanyModel.findById(userDetails.company_id);

  if (!companyData) {
    console.log("no company data")
    return null;
  }

  let {
    unapprovedLeavesTaken,
    approvedLeavesTaken,
    permissionsTaken,
    lateCount,
    compOffDays,
  } = getAttendanceDetails(staffAttendance);

  let totalWorkingDays = monthlyPayroll.noOfWorkingDays;

  let leaveBalance = 0;

  leaveDetail = calculateWorkingDays({
    totalWorkingDays,
    unapprovedLeavesTaken,
    approvedLeavesTaken,
    permissionsTaken,
    lateCount,
    leaveBalance,
    compOffDays,
  });

  const { grossSalary } = payrollDetails;

  const { effectiveWorkingDays, lopDays } = leaveDetail;

  const { salaryDetails } = calculateSalaryBreakdown(
    grossSalary,
    effectiveWorkingDays,
    lopDays
  );

  let department = null;
  let designation = null;

  if (isTrainee) {
    department = userDetails.department;
    designation = userDetails.designation ?? "Trainee";
  } else {
    department = userDetails.department_id.name;
    designation = userDetails.designation.title;
  }

  const paySlipData = {
    user_id: isTrainee?tid:sid,
    colorCode: companyData.colorCode,
    companyLogo: companyData.companyLogo,
    companyName: companyData.companyName,
    companyLocation: companyData.address,
    paySlipMonth,
    employeeName: userDetails.fullName,
    designation,
    employeeId: userDetails.staffId,
    department,
    dateOfJoining: userDetails.doj,
    payDate: monthlyPayroll.payDate,
    pfAccountNumber: payrollDetails.pfNumber,
    uan: payrollDetails.uanNumber,
    salaryDate:payDate,
    netPay: salaryDetails.grossEarnings,
    isPf:payrollDetails.isPf,
    isEsi:payrollDetails.isEsi,
    ...salaryDetails,
    ...leaveDetail,
    amountInWords: numberToWords(salaryDetails.grossEarnings),
  };

  return {paySlipData,user_id:userDetails._id};
};

const managePaySlip = async (data) => {
  const { paySlipData, user_id } = data;

  if (!paySlipData) {
    throw new Error(status.BAD_REQUEST, "Pay slip data is required");
  }
  if (!user_id) {
    throw new Error(status.BAD_REQUEST, "User id is required");
  }
  const { paySlipMonth, employeeId } = paySlipData;
  let existingPaySlipData = await PaySlipModel.findOne({
    paySlipMonth,
    employeeId,
  });

  let finalData = null;

  if (existingPaySlipData) {
    existingPaySlipData.set(paySlipData);
    const isUpdated = await existingPaySlipData.save();
    if (!isUpdated) {
      return null;
    }
    finalData = isUpdated;
  } else {
    const createdPaySlip = await PaySlipModel.create(paySlipData);
    if (!createdPaySlip) {
      return null;
    }
    finalData = createdPaySlip;
  }
  return finalData ?? "Something went wrong";
};

exports.generatePaySlip = async (req, isForTrainee = false) => {
  const { uid, m, y } = req.query;

  if (!m || !y) {
    throw new ApiError(status.BAD_REQUEST, "Provide a proper query");
  }

  let isForOne = false;

  if (uid) {
    isForOne = true;
  }

  let paySlipData = null;

  if (isForOne) {
    if (isForTrainee) {
      paySlipData = await getPaySlipData({ tid: uid, m, y });
    } else {
      paySlipData = await getPaySlipData({ sid: uid, m, y });
    }
    if(!paySlipData){
        throw new ApiError(status.INTERNAL_SERVER_ERROR,"paysilp data in null")
    }
  try {
    const isPaySlipManaged = await managePaySlip({...paySlipData});
    return isPaySlipManaged;
  } catch (error) {
    console.log("Unable to manage the pay slip", error);
    throw new ApiError(
      status.INTERNAL_SERVER_ERROR,
      "Something went wrong please try again"
    );
  }}else{
    let generatePaySlipQuery = null;
    if (isForTrainee) {
        const traineeData = await TraineeModel.find(); // need changes gokul

        if(!traineeData){
            throw new ApiError(status.BAD_REQUEST,"No trainees available")
        }
        generatePaySlipQuery = traineeData.map(trainee=>getPaySlipData({tid:trainee._id,}));

      } else {
        const staffData = await StaffModel.find(); // need changes gokul

        if(!staffData){
            throw new ApiError(status.BAD_REQUEST,"No Staffs are available")
        }
        generatePaySlipQuery = staffData.map(staff=>getPaySlipData({sid:staff._id,}));
      }

      if(!generatePaySlipQuery){
        throw new ApiError(status.INTERNAL_SERVER_ERROR,"Something went wrong please try again");
      }

      const [...managePaySlipData] = await Promise.all(generatePaySlipQuery);
      console.log(managePaySlipData,"managedPaySlipData")
      const managePaySlipQuery = managePaySlipData.map(payslipData=>managePaySlip(payslipData));
      try {
        const [...managedPaySlipData] = await Promise.all(managePaySlipQuery);
        console.log(managedPaySlipData,"managedPaySlipData");
        return managedPaySlipData;
      } catch (error) {
        console.log(error);
      }
  }
};

exports.getPaySlip = async (req) => {
  const { uid, m, y } = req.query;

  if (!uid || !m || !y) {
    throw new ApiError(status.BAD_REQUEST, "Provide a proper query");
  }

  const paySlipMonth = `${MONTHS[m - 1]} ${y}`;

  const paySlipData = await PaySlipModel.findOne({
    paySlipMonth,
    user_id: uid,
  });

  if (!paySlipData) {
    throw new ApiError(
      status.NOT_FOUND,
      `Pay slip is not generated for this month yet`
    );
  }
  return paySlipData;
};

exports.getAllPaySlip = async (req) => {
  const { m, y } = req.query;

  if (!m || !y) {
    throw new ApiError(status.BAD_REQUEST, "Provide a valid query");
  }

  const paySlipMonth = `${MONTHS[m - 1]} ${y}`;

  const paySlipData = await PaySlipModel.find({ paySlipMonth });
  if (!paySlipData) {
    throw new ApiError(status.BAD_REQUEST, `Pay slip is `);
  }
  return paySlipData;
};