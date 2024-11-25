const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");

const conversationSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    sender: {
        type: String,
        ref:'Auth',
        required: true
    },
    receiver: {
        type: String,
        ref:'Auth',
        required: true
    },
    messages:[
        {
            type:String,
            ref:'Message'
        }
    ]
},{timestamps:true,collection:'Conversation'});


const messageSchema = new mongoose.Schema({
    text: schemaFields.requiredAndString,
    imageUrl: schemaFields.requiredAndString,
    videoUrl: schemaFields.requiredAndString,
    seen: schemaFields.BooleanWithDefault,

},{timestamps:true, collection:'Message'})

const ConversationModel = mongoose.model('Conversation',conversationSchema);
const MessageModel = mongoose.model('Message',messageSchema);

module.exports = {ConversationModel,MessageModel};
