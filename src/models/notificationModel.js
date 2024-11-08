const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");


const notificationSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    title: schemaFields.StringWithEnumAndRequired(['Announcement', 'Alert', 'Reminder', 'Message']),
    content: schemaFields.requiredAndString,
    recipientId: schemaFields.StringWithEnumAndRequired([
        'Admin', 'Staff', 'Trainee', 'Hr', 'Cordinator','SuperAdmin',''
    ]),
    status: schemaFields.StringWithEnumAndRequired(['Unread', 'Read', 'Archived'])
    

},{timestamps:true, collection:"Notification"})

const NotificationModel = mongoose.model('Notification',notificationSchema);

module.exports = NotificationModel;