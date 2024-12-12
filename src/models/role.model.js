const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");
const { schema } = require('./authModel');


const RoleSchema = mongoose.Schema({
    _id:schemaFields.idWithV4UUID,
    name: schemaFields.StringAndUnique,
    permissions: schemaFields.ArrayOfStrings,
    hierarchyLevel: schemaFields.NumberWithDefault(1),
    allowedRoutes: schemaFields.ArrayOfStrings,
    isArchive: schemaFields.BooleanWithDefault,
    isActive: schemaFields.BooleanWithDefaultTrue,
  },{timestamp:true,collection:"Role"});

  const RoleModel = mongoose.model('Role',RoleSchema);

  module.exports = { RoleModel }