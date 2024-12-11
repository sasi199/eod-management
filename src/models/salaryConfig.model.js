const { default: mongoose } = require("mongoose");
const schemaFields = require("../utils/schemaFieldUtils");

const lastModifiedHistory = {
    _id:String, // i will populate this field with the user data so this will have the user name, _id:{_id:sdfasdfa,name:xxx}
    date: String, //dd/mm/yyyy
    modifiedFields: [String]
} 

const salaryConfigFields = {
    _id:schemaFields.idWithV4UUID,
    isEmployerEsi:schemaFields.BooleanWithDefaultTrue,
    isEmployerPf:schemaFields.BooleanWithDefaultTrue,
    pf: schemaFields.NumberWithDefault(0.12),
    employerPF: schemaFields.NumberWithDefault(0.12),
    esi: schemaFields.NumberWithDefault(0.0075),
    employerEsi: schemaFields.NumberWithDefault(0.0325),
    basic: schemaFields.NumberWithDefault(0.4),
    hra: schemaFields.NumberWithDefault(0.3),
    conveyance: schemaFields.NumberWithDefault(0.1),
    otherAllowance: schemaFields.NumberWithDefault(0.2),
    sickLeave: schemaFields.NumberWithDefault(1),
    casualLeave: schemaFields.NumberWithDefault(1),
    permission: schemaFields.NumberWithDefault(2),
    permissionDuration: schemaFields.NumberWithDefault(5400),
    checkInTime: schemaFields.StringWithDefault("09:55"),
    checkOutTime: schemaFields.StringWithDefault("18:30"),
    graceTime: schemaFields.NumberWithDefault(300),
    workingHours: schemaFields.NumberWithDefault(270000),
    approvedLate: schemaFields.NumberWithDefault(3),
    startDeductFrom: schemaFields.NumberWithDefault(4),
    lastModified: [lastModifiedHistory],
  }

  const SalaryConfigSchema = mongoose.Schema(salaryConfigFields,{timestamps:true, collection: "SalaryConfig"});

  const SalaryConfigModel = mongoose.model("SalaryConfig", SalaryConfigSchema);

  module.exports = { SalaryConfigModel }