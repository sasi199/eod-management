const mongoose = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');

const assessmentSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    assessmentTitle: schemaFields.requiredAndString,
    assessmentType: schemaFields.StringWithEnumAndRequired(['Quiz', 'Project', 'Presentation']),
    subject: schemaFields.StringWithEnumAndRequired([
        'Html/Css', 'Javascript', 'J-Query', 'React.Js', 'Node.Js/Mongodb', 'Python', 'Figma', 'PHP', 'Flutter'
    ]),
    batch: {
        type: String,
        ref: 'Batch',
        required: true
    },
    questions: [
        {
            questionText: {
                type: String,
                required: true
            },
            questionType: {
                type: String,
                enum: ['Text', 'Image', 'PDF', 'Url'],
                required: true
            },
            mediaURL: {
                type: String,
                required: function () { return this.questionType !== 'Text'; }
            },
            mediaType: {
                type: String,
                enum: ['image/jpeg', 'image/png', 'application/pdf'],
                required: function () { return this.questionType === 'PDF' || this.questionType === 'Image'; }
            }
        }
    ],
    assessmentDate: schemaFields.requiredAndDate,
    assessmentTiming: schemaFields.requiredAndString,
}, { timestamps: true, collection: "Assessment" });

const AssessmentModel = mongoose.model('Assessment', assessmentSchema);

module.exports = AssessmentModel;
