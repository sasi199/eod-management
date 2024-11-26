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
    question: [
        {
            type: String,
            ref: 'Question',
            required: true
        }
    ],
    assessmentDate: schemaFields.requiredAndDate,
    assessmentTiming: schemaFields.requiredAndString,
    attendedMembers: { type: [String], default: [] },
    completedMembers: { type: [String], default: [] },
    marks: { type: Map, of: Number },
    quizAccessStartTime: { type: Date },
}, { timestamps: true, collection: "Assessment" });

const AssessmentModel = mongoose.model('Assessment', assessmentSchema);

module.exports = AssessmentModel;
