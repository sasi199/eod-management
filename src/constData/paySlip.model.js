const schemaFields = require("../utils/schemaFieldUtils");
const { utils } = require("../utils/utils");
const { createModel } = require("./default.model");

const paySlipFields = {
    emp_id: schemaFields.UUIDReferenceField("Employee"),
    basicSalary: schemaFields.RequiredNumberField,
    houseRentAllowance: schemaFields.NumberFieldWithDefault(0),
    specialAllowance: schemaFields.NumberFieldWithDefault(0),
    providentFund: schemaFields.NumberFieldWithDefault(0),
    professionalTax: schemaFields.NumberFieldWithDefault(0),
    incomeTax: schemaFields.NumberFieldWithDefault(0),
    bonuses: schemaFields.NumberFieldWithDefault(0),
    deductions: schemaFields.NumberFieldWithDefault(0),
    netSalary: schemaFields.NumberFieldWithDefault(0),
    paymentDate: schemaFields.NumberFieldWithDefault(0),
    paymentStatus: schemaFields.EnumStringFieldWithDefault(['Paid', 'Pending', 'Overdue'],'Pending'),
    overTime: schemaFields.NumberFieldWithDefault(0), // in minutes
    numberOfLeaves: schemaFields.NumberFieldWithDefault(0),
    compOff: schemaFields.NumberFieldWithDefault(0)
}