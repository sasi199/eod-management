const mongoose = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');


const assignedBatchSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    batchId: schemaFields.requiredAndString,
    assignedTrainer:[{
        type: String,
        ref: 'Staff'
    }],
    assignedTrainee:[{
        type: String,
        ref: 'Trainee'
    }]
},{timestamps:true, collection: "AssignedBatch"})

const AssignedBatchModel = mongoose.model('AssignedBatch',assignedBatchSchema);

module.exports = AssignedBatchModel;