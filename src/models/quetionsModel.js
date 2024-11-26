const mongoose = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');

const questionSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    assessmentId: schemaFields.requiredAndString,
    questionText: { type: String, required: true },
    questionType: { type: String, enum: ['Text', 'Image', 'PDF', 'Url'], required: true },
    mediaURL: { type: String },
    mediaType: { type: String, enum: ['image/jpeg', 'image/png', 'application/pdf'] },
    viewStartTime: { type: Date },
    viewEndTime: { type: Date },
}, { timestamps: true, collection: 'Question' });

const QuestionModel = mongoose.model('Question', questionSchema);

module.exports = QuestionModel;
