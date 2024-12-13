const { default: mongoose } = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');


const departmentFields = {
    _id: schemaFields.idWithV4UUID,
    name: String,
    departmentCode: String,
    description: String,
}

const DepartmentSchema = mongoose.Schema(departmentFields,{timestamp:true,collection:"Department"});

const DepartmentModel = mongoose.model("Department",DepartmentSchema);


module.exports = {DepartmentModel};