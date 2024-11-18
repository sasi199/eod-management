const mongoose = require("mongoose");
const { v4 } = require("uuid");
const userRole = require("../utils/roles");
const schemaFields = require("../utils/schemaFieldUtils");

const authSchema = new mongoose.Schema(
  {
    _id: schemaFields.idWithV4UUID,
    email: schemaFields.requireStringAndUnique,
    logId: schemaFields.requiredAndString,
    password: schemaFields.requiredAndString,
    accountId:{
      type: String
    },
    fullName: {
      type: String,
    },
    hybrid: schemaFields.StringWithEnumAndRequired(['Online','Ofline','WFH']),
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
    dob: {
      type: String,
    },
    // adminId: {
    //   type: String,
    // },
    batch_id: {
      type: String
    },
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
    },
    profile: String,
  },
  { timestamps: true,collection:"Auth" }
);

const Auth = mongoose.model("Auth", authSchema);


module.exports = Auth;