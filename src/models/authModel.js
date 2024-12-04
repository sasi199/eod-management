const mongoose = require("mongoose");
const { v4 } = require("uuid");
const userRole = require("../utils/roles");
const schemaFields = require("../utils/schemaFieldUtils");

const authSchema = new mongoose.Schema(
  {
    _id: schemaFields.idWithV4UUID,
    email: schemaFields.requireStringAndUnique,
    fullName: schemaFields.requiredAndString,
    logId: schemaFields.requiredAndString,
    password: schemaFields.requiredAndString,
    profilePic: schemaFields.requiredAndString,
    accountId:{
      type: String
    },
    batch: schemaFields.requiredAndString,
    hybrid: schemaFields.StringWithEnum(['Online','Offline','WFH']),
    role: {
      type: String,
      enum: [
        "Trainer",
        "Trainee",
        "SuperAdmin",
        "Admin",
        "Coordinator",
        "Employee",
        "HR",
      ],
      required: true,
    },
    // traineeId: {
    //   type: String,
    // },
    // dob: {
    //   type: String,
    // },
    // adminId: {
    //   type: String,
    // },
    // trainerId:{
    //     type:String
    // },
    archive: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    }
  },
  { timestamps: true,collection:"Auth" }
);

const Auth = mongoose.model("Auth", authSchema);


module.exports = Auth;