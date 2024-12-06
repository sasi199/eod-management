const schemaFields = require("../utils/schemaFieldUtils");
const { utils } = require("../utils/utils");
const { createModel } = require("./default.model");

const payRollFields = {
    emp_id: schemaFields.UUIDReferenceField('Employee'),
    basic : schemaFields.RequiredNumberField,
    hra: schemaFields.NumberFieldWithDefault(0),
    conveyance: schemaFields.NumberFieldWithDefault(0),
    otherAllowance: schemaFields.NumberFieldWithDefault(0),
    grossSalary: schemaFields.RequiredNumberField,
    bonus: schemaFields.NumberFieldWithDefault(0),
    pf: schemaFields.NumberFieldWithDefault(0),
    esi: schemaFields.NumberFieldWithDefault(0),
    tax: schemaFields.NumberFieldWithDefault(0),
    gratuity: schemaFields.NumberFieldWithDefault(0)
}

const [PayRollSchema, PayRollModel] = createModel("PayRoll", payRollFields);

module.exports = { PayRollModel };