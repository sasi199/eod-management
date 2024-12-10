const catchAsync = require("../utils/catchAsync");
const PaySlipServices = require('../services/paySlip.services');
const ejs = require('ejs');
const { generatePDF } = require("../utils/utils");

exports.generateTraineePaySlip = catchAsync(async (req, res) => {
    const response = await PaySlipServices.generatePaySlip(req,true);
    res.status(200).json({ success: true, message: "PaySlips generated for trainees successfully", data: response });
});

exports.generateStaffPaySlip = catchAsync(async (req, res) => {
    const response = await PaySlipServices.generatePaySlip(req,false);
    res.status(200).json({ success: true, message: "PaySlips generated for staffs successfully", data: response });
});

exports.getPaySlipById = catchAsync(async (req, res) => {
    const response = await PaySlipServices.getPaySlip(req);
    res.status(200).json({ success: true, message: "PaySlip record fetched successfully", data: response });
});

exports.geOwnPaySlip = catchAsync(async (req, res) => {
    const user_id = req.accountId;
    req.query.uid = user_id
    const response = await PaySlipServices.getPaySlip(req);
    res.status(200).json({ success: true, message: "PaySlip record fetched successfully", data: response });
});

exports.getAllPaySlip = catchAsync(async (req, res) => {
    const response = await PaySlipServices.getAllPaySlip(req);
    res.status(200).json({ success: true, message: "PaySlip records fetched successfully", data: response });
});

exports.downloadPaySlip = catchAsync(async (req, res) => {
    const response = await PaySlipServices.getStaffPaySlip(req);

    const htmlContent = await ejs.renderFile('./src/views/payslip.ejs',response);

    const pdfBuffer = await generatePDF(htmlContent);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=payslip.pdf');

    res.write(pdfBuffer);
    res.end();

    // res.status(200).json({ success: true, message: "PaySlip records  successfully", data: response });
});