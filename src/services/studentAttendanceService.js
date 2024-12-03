const express = require('express');
const httpStatus = require('http-status');
const { AssignedBatchModel } = require('../models/assignedBatchesModel');


exports.getStudentAttendance = async(req)=>{
    const { _id } = req.params;
    if (!_id) {
        return res.status(404).json({ message: '_Id not found' });
    }
    const batch = await AssignedBatchModel.find({batchId:_id}).populate({
        path:'trainee',
        select:'fullName profilePic',
    })

    if (!batch) {
        return res.status(404).json({ message: 'Batch not found' });
    }

    return batch;
}