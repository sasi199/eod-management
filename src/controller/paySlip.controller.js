const catchAsync = require("../utils/catchAsync");
const PaySlipServices = require('../services/paySlip.services');

exports.getAllPayrolls = catchAsync(async (req, res) => {
    const response = await PaySlipServices.getStaffPaySlip(req);
    res.status(200).json({ success: true, message: "PaySlip records fetched successfully", data: response });
});