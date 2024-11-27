const mongoose = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');

const batchSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    courseName: schemaFields.StringWithEnumAndRequired(['Full Stack','Digital Marketing']),
    batchId: schemaFields.requiredAndString,
    batchName:schemaFields.requiredAndString,
    batchTimings: schemaFields.StringWithEnumAndRequired(['10 am to 02 pm','02 pm to 06 pm']),
    courseDuration: schemaFields.StringWithEnumAndRequired(['3 Months','6 Months', '9 Months','12 Months']),
    active: schemaFields.BooleanWithDefaultTrue,
    archive: schemaFields.BooleanWithDefault,
    maxStrength: {
        type: Number,
        default: 25,
    },
}, { timestamps: true, collection: "Batch" });

const BatchModel = mongoose.model('Batch', batchSchema);

module.exports = BatchModel;
