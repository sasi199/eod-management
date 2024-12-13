const { default: mongoose } = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');

const designationFields = {
    _id: schemaFields.idWithV4UUID,
    title: String,
    description: String,
    department_id: schemaFields.UUIDIdReference('Department'),
    level: schemaFields.NumberWithDefault(1),
}

const DesignationSchema = mongoose.Schema(designationFields,{timestamp:true,collection:"Designation"});

const DesignationModel = mongoose.model("Designation",DesignationSchema);

module.exports =  {DesignationModel} 