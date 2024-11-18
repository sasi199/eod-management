const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');
const schemaFields = {
    idWithV4UUID: { type: String, default: uuidv4 },
    requiredAndString: { type: String, required: true, trim: true },
    DateWithDefault: { type: Date, default: Date.now },
    StringWithEnumAndDefault: (enumValues, defaultValue) => ({
        type: String,
        enum: enumValues,
        default: defaultValue,
    }),
};

const taskSchema = new mongoose.Schema(
    {
        _id: schemaFields.idWithV4UUID,
        title: schemaFields.requiredAndString,
        description: { type: String, trim: true },
        dueDate: schemaFields.DateWithDefault,
        priority: schemaFields.StringWithEnumAndDefault(
            ['high', 'medium', 'low', 'normal'],
            'normal'
        ),
        stage: schemaFields.StringWithEnumAndDefault(
            ['todo', 'in progress', 'completed'],
            'todo'
        ),
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
        assignees: [
            {
                userId: { type: String, required: true },
                assignedAt: { type: Date, default: Date.now },
            },
        ],
        tags: [{ type: String, trim: true }],
    },
    {
        timestamps: true,
        collection: 'Tasks',
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
