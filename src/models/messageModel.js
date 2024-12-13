const mongoose = require('mongoose');
const { v4 } = require("uuid");

const messageSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: v4,
      },
      senderId: {
        type: String,
      },
      receiverId: {
        type: Array,
        default: [],
      },
      chat_id: {
        type: String,
      },
      time: {
        type: String,
      },
      message: {
        type: String,
      },
      captionMessage: {
        type: String
      },
      roomId: {
        type: String,
      },
      tag: {
        type: String,
      },
      date: {
        type: String,
      },
      messageType: {
        type: String,
      },
      messageTime: {
        type: String,
      },
      reaction: {
        type: String,
      },
      senderName: {
        type: String,
      },
      profile: {
        type: String,
      },
      messageStatus: {
        type: Array,
        default: [],
      },
      fileName: {
        type: String,
      },
      fileType: {
        type: String,
      },
      fileFormat: {
        type: String,
      },
      groupType: {
        type: String,
      },
      fileSize: {
        type: String,
      },
      mimeType: {
        type: String,
      },
      addMessage: {
        type: String,
      },
},{ timestamps: true, collection: 'Message' })


const MessageModel = mongoose.model('Message', messageSchema);

module.exports = MessageModel;