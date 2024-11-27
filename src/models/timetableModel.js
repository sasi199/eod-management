const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");

const timetableSchema= new mongoose.Schema({
        startTime: {
            type: String,
            required: true,
        },
        endTime: {
            type: String,
            required: true,
        },
        subject: schemaFields.StringWithEnumAndRequired([
            'Html/Css','Javascript','Bootstrap','Jquery','React.js','Node.js/Mongodb','Python',
            'Php','Figma'
        ]),
        trainer: {
            type: String,
            ref: "Staff",
            required: true,
        },
        batch: {
            type: String,
            ref: "Batch",
            required: true,
        },
        date: {
            type: Date,
            required: true,
        },
        stage: {
            type: String,
            enum: ['not started','started','completed']
        }
},{timestamps:true,collection:'Timetable'});

const TimetableModel = mongoose.model('Timetable',timetableSchema);

module.exports = TimetableModel;