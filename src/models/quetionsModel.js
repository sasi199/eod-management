const mongoose = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');

const questionSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    assessmentId: schemaFields.requiredAndString,
    mediaURL: schemaFields.requiredAndString,
    viewStartTime: { type: Date },
    viewEndTime: { type: Date },
}, { timestamps: true, collection: 'Question' });

const QuestionModel = mongoose.model('Question', questionSchema);

module.exports = QuestionModel;
