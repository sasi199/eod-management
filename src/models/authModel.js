const mongoose = require("mongoose");
const { v4 } = require("uuid");
const userRole = require("../utils/roles");

const authSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: v4,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    logId: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
    },
    role: {
      type: String,
      enum: [
        "trainer",
        "trainee",
        "superAdmin",
        "admin",
      ],
      required: true,
    },
    traineeId: {
      type: String,
    },
    dob: {
      type: String,
    },
    adminId: {
      type: String,
    },
    batch_id: {
      type: String
    },
    trainerId:{
        type:String
    },
    archive: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    profile: String,
  },
  { timestamps: true,collection:"Auth" }
);

const Auth = mongoose.model("Auth", authSchema);


module.exports = Auth;