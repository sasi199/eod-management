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
        <p><b>User:</b> ${user.fullName} (${user.email})</p>
        <p><b>Leave Type:</b> ${leaveType}</p>
        <p><b>Start Date:</b> ${startDate}</p>
        <p><b>End Date:</b> ${endDate || "N/A"}</p>
        <p><b>Reason:</b> ${reason || "N/A"}</p>
        <p><b>Status:</b> Pending</p>
        <button><b>Approved</b></button>
    `;


    const emailResponse = await utils.sendEmail(config.email.hrEmail, emailSubject, emailHtml);
    console.log(emailResponse,'akslkslalk');
    
    if (!emailResponse.status) {
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, { message: emailResponse.message });
    }

    return leave;  
}


exports.approveLeave = async(req)=>{
    const { isApproved,} =req.body 
    const {_id} = req.params
    const leave = await LeaveApplyModel.findById(_id);
    if (!leave) {
        throw new Error('Leave request not found');
    }

    leave.status = isApproved ? 'approved' : 'rejected';
    console.log(`Leave status updated to: ${leave.status}`);
    if (isApproved) {
        console.log("Updating hybrid status");
    }

    await leave.save();
    return leave
}



const updateHybridStatus = async (userId, startDate, endDate, leaveType) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : start;

    // Update Auth model for leave period
    for (
        let currentDate = start;
        currentDate <= end;
        currentDate.setDate(currentDate.getDate() + 1)
    ) {
        const dateStr = currentDate.toISOString().split('T')[0];
        await Auth.updateOne(
            { accountId: userId },
            { hybrid: leaveType }
        );

        // Schedule reset to "Offline"
        scheduleResetHybridStatus(userId, currentDate);
    }
};



// const scheduleResetHybridStatus = (userId, currentDate) => {
//     const resetDate = new Date(currentDate);
//     resetDate.setDate(resetDate.getDate() + 1);
//     resetDate.setHours(0, 0, 0, 0);

//     const delay = resetDate.getTime() - Date.now();
//     if (delay > 0) {
//         setTimeout(async () => {
//             await Auth.updateOne(
//                 { accountId: userId },
//                 { hybrid: 'Offline' }
//             );
//         }, delay);
//     }
// };

