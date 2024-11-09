const mongoose = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');

const batchSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    // course_id: schemaFields.requiredAndString,
    courseName: schemaFields.StringWithEnumAndRequired(['Full Stack','Digital Marketing']),
    // courseId: schemaFields.idWithV4UUID,
    // subjects: schemaFields.arrayWithDefault(),
    batchId: schemaFields.requiredAndString,
    batchName:schemaFields.requiredAndString,
    batchTimings: schemaFields.requiredAndString,
    startDate: schemaFields.StringWithDefault(),
    active: schemaFields.BooleanWithDefaultTrue,
    archive: schemaFields.BooleanWithDefault,
    maxStrength: {
        type: Number,
        default: 25,
    },
    trainees: [{
        type: String,
        ref: 'Trainee'
    }]
}, { timestamps: true, collection: "Batch" });

const BatchModel = mongoose.model('Batch', batchSchema);

module.exports = BatchModel;
