const { default: mongoose } = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');
const { getCurrentMonthYear, getWorkingDays, formatDate } = require('../utils/utils');

const {month,year} = getCurrentMonthYear();

const formattedDateString = `${month}-${year}`

const {workingDays,holidays, startDate, endDate, payDate} = getWorkingDays(month,year);

const monthlyPayrollConfigFields = {
    _id: schemaFields.idWithV4UUID,
    dateString: schemaFields.StringWithDefault(formattedDateString),
    date: schemaFields.StringWithDefault(new Date),
    noOfWorkingDays: schemaFields.NumberWithDefault(workingDays),
    numberOfPaidHolydays: schemaFields.NumberWithDefault(holidays),
    startDate: schemaFields.StringWithDefault(formatDate(startDate)),
    endDate: schemaFields.StringWithDefault(formatDate(endDate)),
    payDate: schemaFields.StringWithDefault(formatDate(payDate))
}

const MonthlyPayrollSchema = mongoose.Schema(monthlyPayrollConfigFields,{timestamp:true,collection:"MonthlyPayRoll"})

const MonthlyPayrollModel = mongoose.model('MonthlyPayRoll',MonthlyPayrollSchema);

module.exports = {MonthlyPayrollModel};