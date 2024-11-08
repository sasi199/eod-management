const mongoose = require('mongoose');
const schemaFields = require("../utils/schemaFieldUtils");

const chatSchema = new mongoose.Schema({
    _id: schemaFields.idWithV4UUID,
    roomId: schemaFields.idWithV4UUID,
    chatType: schemaFields.StringWithEnumAndRequired(['Group', 'Individual']),
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Auth',
            required: true
        }
    ],
    chatName: {
        type: String,
        required: function() { return this.chatType === 'Group'; }
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
    },
    admins: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Auth',
        }
    ],
    messages: [
        {
            sender: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Auth',
                required: true
            },
            messageType: {
                type: String,
                enum: ['Text', 'Image', 'File'],
                default: 'Text'
            },
            content: {
                type: String,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            },
            mediaURL: {
                type: String,
                required: function() { return this.messageType !== 'Text'; }
            },
            fileName: String,
            fileType: String,
            fileSize: String,
            mimeType: String,
            reaction: String,
        }
    ],
    lastMessage: {
        type: String
    },
    lastMessageUserId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth'
    },
    messageStatus: [
        {
            userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Auth'
            },
            status: {
                type: String,
                enum: ['Sent', 'Delivered', 'Read'],
                default: 'Sent'
            }
        }
    ],
    active: {
        type: Boolean,
        default: true
    },
    archive: {
        type: Boolean,
        default: false
    }

}, { timestamps: true, collection: 'Chat' });

const ChatModel = mongoose.model('Chat', chatSchema);

module.exports = ChatModel;
