const config = require("../config/config");
const Auth = require("../models/authModel");
const LeaveApplyModel = require("../models/leavePermissionModel");
const ApiError = require("../utils/apiError");
const httpStatus = require("http-status");
const utils = require("../utils/utils");
const schedule = require("node-schedule");
const StaffModel = require("../models/staffModel");
const TraineeModel = require("../models/traineeModel");
const { DesignationModel } = require("../models/designation.model");
const AttendanceModel = require("../models/attendance");

const leaveExtractor = (accountId, leaveData) => {
  const othersData = null;
  const myLeaveData = null;
  leaveData.forEach((leave) => {
    if (leave.userId === accountId) {
      myLeaveData.push(leave);
    } else {
      othersData.push(leave);
    }
  });
  return { othersData, myLeaveData };
};

exports.applyLeaveRequset = async (req) => {
  const { user:userData } = req;
  const { leaveType, startDate, endDate, reason, startDateString, endDateString } = req.body;

//   const user = await Auth.findOne({ accountId: accountId });
//   if (!user) {
//     throw new ApiError(httpStatus.BAD_REQUEST, { message: "User not found" });
//   }

  const validLeaveTypes = [
    "sick",
    "casual",
    "annual",
    "permission",
    "wfh",
    "online",
  ];
  if (!validLeaveTypes.includes(leaveType)) {
    throw new ApiError(httpStatus.BAD_REQUEST, {
      message: "Invalid leave type",
    });
  }

  const leave = new LeaveApplyModel({
    userId: userData.accountId,
    date: startDate,
    endDate: endDate || null,
    leaveType: leaveType,
    status: "pending",
    reason: reason,
    endDateString,
    startDateString
  });

  await leave.save();

  const emailSubject = `Leave Request from ${user.name}`;
  const emailHtml = `
    <h3>Leave Request</h3>
    <p><b>User:</b> ${user.fullName} (${user.email})</p>
    <p><b>Leave Type:</b> ${leaveType}</p>
    <p><b>Start Date:</b> ${startDate}</p>
    <p><b>End Date:</b> ${endDate || "N/A"}</p>
    <p><b>Reason:</b> ${reason || "N/A"}</p>
    <p><b>Status:</b> Pending</p>
    <a href="${config.baseUrl}/v1/leave/approveLeave/${
    leave._id
  }" style="padding:10px 15px; background-color:green; color:white; text-decoration:none; border-radius:5px;">Approve</a>
`;

  const emailResponse = await utils.sendEmail(
    config.email.hrEmail,
    emailSubject,
    emailHtml
  );
  console.log(emailResponse, "akslkslalk");

  if (!emailResponse.status) {
    throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, {
      message: emailResponse.message,
    });
  }

  return leave;
};

exports.approveLeave = async (req) => {
  const { _id } = req.params;
  const {ap} = req.query
  const leave = await LeaveApplyModel.findById(_id);
  if (!leave) {
    throw new Error("Leave request not found");
  }

  console.log(ap,"ap")
  const isApproved = ap==1;
  leave.status = isApproved ? "approved" : "rejected";
  console.log(`Leave status updated to: ${leave.status}`);

  if (isApproved) {
    console.log("Updating hybrid status");
    // Update hybrid status for the duration of the leave
    await updateHybridStatus(
      leave.userId,
      leave.date,
      leave.endDate,
      leave.leaveType
    );
  }

  await leave.save();

  const user = await Auth.findOne({ accountId: leave.userId });
  if (user) {
    const emailSubject = `Your Leave Request Approved`;
    const emailHtml = `
                <p>Dear ${user.fullName},</p>
                <p>Your leave request has been approved:</p>
                <ul>
                    <li><b>Leave Type:</b> ${leave.leaveType}</li>
                    <li><b>Start Date:</b> ${leave.date}</li>
                    <li><b>End Date:</b> ${leave.endDate || "N/A"}</li>
                </ul>
                <p>Enjoy your leave!</p>
            `;
    await utils.sendEmail(user.email, emailSubject, emailHtml);
  }

  return leave;
};

exports.getAllLeaves = async (req) => {
  const { role, user } = req;
  console.log(user.role,"user.role")
  if(user.role.hierarchyLevel ===1){
    const leaves = await LeaveApplyModel.find().populate("userId");
    return {othersData:leaves};
  }

  const designationDataQuery = DesignationModel.find({department_id:user.department});
  const authDataQuery = Auth.find();

  const [designationData, authData] = await Promise.all([
    designationDataQuery,
    authDataQuery
  ])

  if(!designationData){
  }

  const designationIds = designationData.filter(designation=>user.designation.level<=designation.level); 

  console.log(designationIds,"desId")
  const authIds = authData.filter(auth=>designationIds.includes(auth.designation));
  console.log(authIds,"auth")
//   const attendanceData = await LeaveApplyModel.find({user:{$or:[{$in:authIds},{$eq:user._id}]}});
const attendanceData = await LeaveApplyModel.find({
    $or: [
      { user: { $in: authIds } },
      { user: user._id }
    ]
  });

  console.log(attendanceData,"hllo");

  return leaveExtractor(attendanceData);
};

const updateHybridStatus = async (userId, startDate, endDate, leaveType) => {
  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : new Date(startDate); // If no endDate, it's a single-day leave

  // Ensure valid date range
  if (end < start) {
    console.error("End date cannot be earlier than start date");
    return;
  }

  // Valid leave types for hybrid status
  const validHybridLeaves = ["sick", "wfh", "online", "casual"];
  if (!validHybridLeaves.includes(leaveType)) {
    console.log(
      `Leave type '${leaveType}' does not require hybrid status update`
    );
    return;
  }

  // Handle single-day leave
  if (start.toDateString() === end.toDateString()) {
    console.log(
      `Single-day leave detected for ${start.toISOString().split("T")[0]}`
    );

    // Update hybrid status for the single day
    await Auth.updateOne({ accountId: userId }, { hybrid: leaveType });

    // Schedule reset to "Offline" for the next day
    scheduleResetHybridStatus(userId, start);
    return;
  }

  // Iterate through the date range for multi-day leave
  for (
    let currentDate = new Date(start); // Clone the start date
    currentDate <= end;
    currentDate.setDate(currentDate.getDate() + 1)
  ) {
    const dateStr = currentDate.toISOString().split("T")[0];
    console.log(`Updating hybrid status for ${dateStr}`);

    // Update hybrid status in the Auth model for the leave day
    await Auth.updateOne({ accountId: userId }, { hybrid: leaveType });

    // Schedule reset to "Offline" the next day
    scheduleResetHybridStatus(userId, new Date(currentDate)); // Clone the date
  }
};

const scheduleResetHybridStatus = (userId, currentDate) => {
  const resetDate = new Date(currentDate);
  resetDate.setDate(resetDate.getDate() + 1);
  resetDate.setHours(0, 0, 0, 0);

  console.log(`Scheduling hybrid status reset for ${userId} at ${resetDate}`);

  // Schedule the job
  schedule.scheduleJob(resetDate, async () => {
    console.log(`Scheduled job triggered at: ${new Date()}`);
    console.log(`Resetting hybrid status for ${userId} to 'Offline'`);
    await Auth.updateOne({ accountId: userId }, { hybrid: "Offline" });
  });
};
