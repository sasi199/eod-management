const mongoose = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');


const traineeTaskSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    title: schemaFields.requiredAndString,
    description: { type: String },
    dueDate: schemaFields.DateWithDefault,
    trainerId: { type: String, ref: 'Staff' },
    batchId: { type: String, ref: 'AssignedBatch' },
    priority: schemaFields.StringWithEnumAndDefault(['high', 'medium', 'low', 'normal'], 'normal'),
},{timestamps:true,collection:'TraineeTask'});


const TraineeTaskModel = mongoose.model('TraineeTask',traineeTaskSchema);

module.exports = TraineeTaskModel;