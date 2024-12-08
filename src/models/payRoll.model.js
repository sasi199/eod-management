const schemaFields = require("../utils/schemaFieldUtils");
const { utils } = require("../utils/utils");
const { createModel } = require("./default.model");

const payRollFields = {
    _id: schemaFields.idWithV4UUID,
    staff_id: schemaFields.UUIDIdReference('Staff'),
    grossSalary: schemaFields.requiredNumberWithDefault(0),
    isPf: schemaFields.BooleanWithDefaultTrue,
    isEsi: schemaFields.BooleanWithDefaultTrue,
    isGratuity: schemaFields.BooleanWithDefaultTrue
}

const [PayRollSchema, PayRollModel] = createModel("PayRoll", payRollFields);

module.exports = { PayRollModel };