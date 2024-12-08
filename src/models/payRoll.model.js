const { default: mongoose } = require("mongoose");
const schemaFields = require("../utils/schemaFieldUtils");

const payrollFields = {
    _id: schemaFields.idWithV4UUID,
    staff_id: schemaFields.UUIDIdReference('Staff'),
    grossSalary: schemaFields.requiredNumberWithDefault(0),
    isPf: schemaFields.BooleanWithDefaultTrue,
    isEsi: schemaFields.BooleanWithDefaultTrue,
    isGratuity: schemaFields.BooleanWithDefault,
}

const PayrollSchema = mongoose.Schema(payrollFields,{timestamp: true, collection:"Payroll"});

const PayrollModel =  mongoose.model("Payroll", PayrollSchema);

module.exports = { PayrollModel };