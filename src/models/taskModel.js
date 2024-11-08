const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");

const taskSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    title: schemaFields.requiredAndString,
    date: schemaFields.DateWithDefault,
    prirority: schemaFields.StringWithEnumAndDefault(['high','medium','low','normal']),
    stage: schemaFields.StringWithEnumAndDefault(['todo','in progress','completed']),
    activities: {
        type:{
            type:String,
            default: "assigned",
            enum: [
                "assigned",
                "started",
                "in progress",
                "bug",
                "completed"
            ]
        },
        activitiey:String,
        date: {type: Date, default: new Date()},
    },

}, { timestamps: true, collection: "Task" });

const TaskModel = mongoose.model('Task',taskSchema);

module.exports = TaskModel;

