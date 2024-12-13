const mongoose = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');

const assessmentSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    assessmentTitle: schemaFields.requiredAndString,
    subject: schemaFields.StringWithEnumAndRequired([
        'Html/Css', 'Javascript', 'J-Query', 'React.Js', 'Node.Js/Mongodb', 'Python', 'Figma', 'PHP', 'Flutter'
    ]),
    batch: {
        type: String,
        ref: 'Batch',
        required: true
    },
    mediaUrl: schemaFields.requiredAndString,
    assessmentTiming: schemaFields.requiredAndString,
    attendedMembers: { type: [String], default: [] },
    completedMembers: { type: [String], default: [] },
    marks: { type: Map, of: Number },
}, { timestamps: true, collection: "Assessment" });

const AssessmentModel = mongoose.model('Assessment', assessmentSchema);

module.exports = AssessmentModel;
