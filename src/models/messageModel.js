const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");

const messageSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    sender:{
        type: String,
        ref: 'Auth'
    },
    receiver:{
        type: String,
        ref: 'Auth'
    },
    chat:{
        type: String,
        ref: 'Chat'
    },
    text: schemaFields.requiredAndString,
    imageUrl: {
        type: String,
        default: null,
    },
    videoUrl: {
        type: String,
        default: null,
    },
    seen: {
        type: Boolean,
        default: false,
    },
},{timestamps:true,collection:'Message'});

const MessageModel = mongoose.model('Message',messageSchema);

module.exports = MessageModel;