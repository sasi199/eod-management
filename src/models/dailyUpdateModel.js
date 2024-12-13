const mongoose = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');


const dailyUpdateSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,

},{timestamps:true,collection:"DailyUpdate"});

const DailyUpdateModel = mongoose.model("DailyUpdate",dailyUpdateSchema);

module.exports = DailyUpdateModel;
