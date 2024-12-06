const config = require("../config/config");
const Auth = require("../models/authModel");
const LeaveApplyModel = require("../models/leavePermissionModel");
const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');
const utils = require("../utils/utils");


exports.applyLeaveRequset = async(req)=>{
    const { accountId } = req;
    const {leaveType, startDate, endDate, reason } = req.body;

    const user = await Auth.findOne({accountId:accountId});
    if (!user) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"User not found"});
    }
    
    const validLeaveTypes = ['sick', 'casual', 'annual','permission','wfh','online'];
    if (!validLeaveTypes.includes(leaveType)) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "Invalid leave type" });
    }

    const leave = new LeaveApplyModel({
        userId: user.accountId,
        date: startDate,
        endDate: endDate || null,
        leaveType: leaveType,
        status: "pending",
        reason: reason
    })

    await leave.save();

    const emailSubject = `Leave Request from ${user.name}`;
    const emailHtml = `
        <h3>Leave Request</h3>
        <p><b>User:</b> ${user.name} (${user.email})</p>
        <p><b>Leave Type:</b> ${leaveType}</p>
        <p><b>Start Date:</b> ${startDate}</p>
        <p><b>End Date:</b> ${endDate || "N/A"}</p>
        <p><b>Reason:</b> ${reason || "N/A"}</p>
        <p><b>Status:</b> Pending</p>
    `;


    const emailResponse = await utils.sendEmail(config.email.hrEmail, emailSubject, emailHtml);
    console.log(emailResponse,'akslkslalk');
    
    if (!emailResponse.status) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, { message: emailResponse.message });
    }

    return leave;  
}

