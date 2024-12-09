const catchAsync = require("../utils/catchAsync");
const PaySlipServices = require('../services/paySlip.services');
const ejs = require('ejs')

exports.getPaySlip = catchAsync(async (req, res) => {
    const response = await PaySlipServices.getStaffPaySlip(req);
    res.status(200).json({ success: true, message: "PaySlip records fetched successfully", data: response });
});

exports.downloadPaySlip = catchAsync(async (req, res) => {
    const response = await PaySlipServices.getStaffPaySlip(req);

    const htmlContent = await ejs.renderFile('../views/payslip.ejs',response);

    const pdfBuffer = await generatePDF(htmlContent);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=payslip.pdf');

    res.write(pdfBuffer);
    res.end();

    // res.status(200).json({ success: true, message: "PaySlip records  successfully", data: response });
});