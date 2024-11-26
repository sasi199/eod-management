const Auth = require("../models/authModel");
const ReportModel = require("../models/reportModel");
const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');



exports.createReport = async(req)=>{
    const {title, content, reportTo } = req.body

    const reportedToUser = await Auth.findOne({fullName:reportTo});
    console.log(reportedToUser,"zzzzz");
    
    if (!reportedToUser) {
        throw new ApiError(httpStatus.BAD_REQUEST, "The user you're reporting to does not exist.");
    }

    const newReport = new ReportModel({
        ...req.body,
        reportTo: reportedToUser._id
    })

    await newReport.save();
    return newReport;
}

exports.getReportAll = async(req)=>{
    const report = await ReportModel.find().populate({
        path:'reportTo',
        select:'fullName profilePic role'
    })
    if (!report) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Report not found")
    }
    return report;
}

exports.getReportId = async(req)=>{
    const { _id } = req.params;

    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Report id Required")
    }

    const report = await ReportModel.findById(_id)
    if (!report) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Report not found")
    }
    return report;
}

exports.editReport = async(req)=>{
    const {_id} = req.params
    
    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Report id Required")
    }

    const report = await ReportModel.findById(_id)
    if (!report) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Report not found")
    }

    const updateData = {...req.body}
    const updateReport =  await ReportModel.findByIdAndUpdate(_id,updateData,
        {new: true, runValidators: true}
    )

    await updateReport.save();
    return updateReport;
}


exports.deleteReport = async(req)=>{
    const { _id } = req.params
    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Report id Required")
    }

    const report = await ReportModel.findById(_id)
    console.log("report",report);
    
    if (!report) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Report not found")
    }

    await ReportModel.findByIdAndDelete(_id);
}


exports.replayReport = async(req)=>{
    const { _id } = req.params;
    
    const { replay } = req.body;

    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Report id Required") 
    }

    const report = await ReportModel.findOne({_id});
    console.log(report,"ahsgsjsj");
    
    if (!report) {
        throw new ApiError(httpStatus.BAD_REQUEST, "Report not found")
    }

    report.replay = replay;
    report.status = "Readed";


    await report.save();
    return report;

} 


