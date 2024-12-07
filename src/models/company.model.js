const mongoose = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');

const companyFields = {
    _id: schemaFields.idWithV4UUID, 
    companyName: schemaFields.requiredAndString,
    companyCode: schemaFields.requireStringAndUnique,
    address: schemaFields.StringWithDefault('Not provided'),
    contactNumber: schemaFields.StringWithDefault('Not provided'),
    website: schemaFields.StringWithDefault('http://example.com'),
}

const CompanySchema = new mongoose.Schema(companyFields,{timestamps:true,collection:"Company"});

const CompanyModel = mongoose.model('Company', CompanySchema);

module.exports = CompanyModel;
