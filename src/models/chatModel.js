const mongoose  = require('mongoose');
const schemaFields = require('../utils/schemaFieldUtils');


const chatSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    chatName: schemaFields.requiredAndString,
    isGroupChat: schemaFields.BooleanWithDefault,
    users:[{
        type: String,
        ref: 'Auth'
    }],
    latestMessage:{
        type: String,
        ref: 'Message'
    },
    groupAdmin:{
        type: String,
        ref: 'Auth'
    }
},{timestamps:true,collection:'Chat'});

const ChatModel = mongoose.model('Chat',chatSchema);

module.exports = ChatModel;