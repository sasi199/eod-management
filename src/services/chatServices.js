const httpStatus = require('http-status');
const ApiError = require('../utils/apiError');
const ChatModel = require('../models/chatModel');




exports.createChat = async(req)=>{
    const { chatType, participants, createdBy, chatName} = req.body

    if (!chatType || !['Group', 'Individual'].includes(chatType)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Invalid chat type. Must be "Group" or "Individual".');
    }

    if (!participants || !Array.isArray(participants) || participants.length === 0) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Participants must be a non-empty array.');
    }

    if (chatType === 'Individual') {
        if (participants.length !== 2 ) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Individual chats must have exactly two participants.');
        }
    }

   const existingChat = await ChatModel.findOne({
    chatType: 'Individual',
    participants: {$all: participants, $size: 2}
   })

   if (existingChat) {
    throw new ApiError(httpStatus.CONFLICT, 'Chat between these participants already exists.');
   }

   if (chatType === 'Group') {
    if (!chatName) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Group chats require a name.');
    }

    if (!participants.includes(createdBy)) {
        participants.push(createdBy)

    }

   }

   const newChat  = new ChatModel({
    chatType,
    participants,
    createdBy,
    chatName: chatType === 'Group' ? chatName: undefined,
    roomId,
    admins: chatType === 'Group' ? [createdBy] : [],
   })

    await newChat.save();

    return newChat;
}



exports.getChats = async (userId) => {
    const chats = await ChatModel.find({ participants: userId })
        .populate('participants', 'name profilePic')
        .populate('createdBy', 'name')
        .sort({ updatedAt: -1 });

    return chats;
};



exports.getChatById = async (chatId) => {
    const chat = await ChatModel.findById(chatId)
        .populate('participants', 'name profilePic')
        .populate('createdBy', 'name')
        .populate('messages.sender', 'name profilePic');

    if (!chat) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Chat not found.');
    }

    return chat;
};



exports.updateChat = async (chatId, updates) => {
    const chat = await ChatModel.findById(chatId);

    if (!chat) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Chat not found.');
    }

    if (chat.chatType === 'Individual') {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Cannot update individual chat.');
    }

    
    Object.assign(chat, updates);
    await chat.save();

    return chat;
};



exports.deleteChat = async (chatId) => {
    const chat = await ChatModel.findById(chatId);

    if (!chat) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Chat not found.');
    }

    await ChatModel.findByIdAndDelete(chatId);

    return { message: 'Chat deleted successfully.' };
};




exports.sendMessage = async (chatId, messageData) => {
    const { sender, messageType, content, mediaURL, fileName, fileType, fileSize, mimeType } = messageData;

    const chat = await ChatModel.findById(chatId);

    if (!chat) {
        throw new ApiError(httpStatus.NOT_FOUND, 'Chat not found.');
    }

    const newMessage = {
        sender,
        messageType,
        content,
        mediaURL,
        fileName,
        fileType,
        fileSize,
        mimeType,
        timestamp: new Date(),
    };

    chat.messages.push(newMessage);
    chat.lastMessage = content || (mediaURL ? 'Media sent' : '');
    chat.lastMessageUserId = sender;

    await chat.save();
    return newMessage;
};

