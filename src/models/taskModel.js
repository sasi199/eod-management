const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");

const taskSchema = new mongoose.Schema(
    {
        _id: schemaFields.idWithV4UUID,
        title: schemaFields.requiredAndString,
        description: {
            type: String
        },
        dueDate: schemaFields.DateWithDefault,
        projectId:{
            type: String,
            ref: "Project"
        },
        priority: schemaFields.StringWithEnumAndDefault(['high', 'medium', 'low', 'normal'],'normal'),
        status: schemaFields.StringWithEnumAndDefault(['todo', 'in progress', 'completed'],'todo'),
        activities: [
            {
                type: schemaFields.StringWithEnumAndDefault(
                    ['assigned', 'started', 'in progress', 'bug', 'completed'],
                    'assigned'
                ),
                activity: { type: String, trim: true }, 
                date: { type: Date, default: Date.now },
            },
        ],
        assignees: [{
                type: String,
                ref: 'Staff'
            }],
        tags: [{ type: String, trim: true }],
    },
    {
        timestamps: true,
        collection: 'Task',
    }
);


taskSchema.virtual('formattedDueDate').get(function () {
    return this.dueDate ? this.dueDate.toISOString().split('T')[0] : null;
});


taskSchema.index({ title: 1, priority: 1, stage: 1 });


taskSchema.pre('save', function (next) {
    if (this.activities.length === 0) {
        this.activities.push({
            type: 'assigned',
            activity: 'Task created',
        });
    }
    next();
});

const TaskModel = mongoose.model('Task', taskSchema);

module.exports = TaskModel;
