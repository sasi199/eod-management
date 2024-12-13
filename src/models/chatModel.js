const mongoose = require('mongoose');
const { v4 } = require("uuid");

const chatSchema = new mongoose.Schema({
    _id: {
        type: String,
        default: v4,
    },
    chatName: {
        type: Array,
        default: [],
    },
    folderId: {
        type: String,
    },
    type: {
        type: String,
    },
    createdBy: {
        type: String,
    },
    admins: {
        type: Array,
        default: [],
    },
    profile: {
        type: Array,
        default: [],
    },
    instituteId: {
        type: String,
    },
    roomId: {
        type: String,
        default: v4,
    },
    lastMessage: {
        type: String,
    },
    lastMessageUserId: {
        type: String,
    },
    lastMessageFileType: {
        type: String
    },
    count: {
        type: Array,
        default: [],
    },
    messageTime: {
        type: String,
    },
    participants: {
        type: Array,
        default: [],
    },
    messageStatus: {
        type: Array,
        default: [],
    },
    department: {
        type: String
    },
}, { timestamps: true, collection: 'Chat' });

const ChatModel = mongoose.model("Chat", chatSchema);

module.exports = ChatModel;