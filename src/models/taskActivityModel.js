const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['assigned', 'started', 'in progress', 'bug', 'completed', 'updated'],
      default: 'assigned',
    },
    activity: { 
      type: String, 
      trim: true, 
    },
    date: { 
      type: Date, 
      default: Date.now 
    },
    taskId: {
      type: String,
      ref: 'Task',
      required: true
    }
  },{timestamps: true,collection: 'TaskActivity',});

const ActivityModel = mongoose.model('TaskActivity', activitySchema);

module.exports = ActivityModel;
