const ScheduleModel = require("../models/sheduleModel");



exports.createSchedule = async(req)=>{
    const { batchId, trainer,} = req.body;

    const batch = await BatchModel.findById(batchId);
    
}