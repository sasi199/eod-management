const mongoose = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');



const studentProgressSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    taskId: { type: String, ref: 'TraineeTask' },
    traineeId: { type: String, ref: 'Trainee' }, 
    status: schemaFields.StringWithEnumAndDefault(['not attended', 'in progress', 'completed'], 'not attended'),
    
}, { timestamps: true, collection: 'StudentProgress' });

const StudentProgressModel = mongoose.model('StudentProgress',studentProgressSchema);

module.exports = StudentProgressModel;