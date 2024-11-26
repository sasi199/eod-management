const ChatModel = require("../models/chatModel");
const MessageModel = require("../models/messageModel");
const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');
const uploadCloud = require("../utils/uploadCloud");


exports.createChat = async(req)=>{
    const { authId } = req
    const { _id } = req.params;

    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, {message:"Recevier id required"});
    }

    let chat = await ChatModel.findOne({
        isGroupChat: false,
        users: { $all: [authId, _id] },
    }).populate("users", "-password");

    
    if (chat) {
        return chat;
    }

    chat = new ChatModel({
        chatName: 'Private Chat',
        isGroupChat: false,
        users: [authId, _id],
    });

    await chat.save();
    return chat;
}


exports.sendMessage = async(req)=>{
    const { authId } =req;
    const { _id } = req.params;
    const { text } = req.body;
    
    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "Chat ID is required" });
    }

    if (!text && !req.files) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "Message content cannot be empty" });
    }

    
    const chat = await ChatModel.findById(_id);
    if (!chat) {
        throw new ApiError(httpStatus.NOT_FOUND, { message: "Chat not found" });
    }


    let imageUrl = null;
    let videoUrl = null;

    if (req.files) {
        if (req.files.imageUrl && req.files.imageUrl[0]) {
            const fileExtension = req.files.imageUrl[0].originalname.split('.').pop();
            const fileName = `image/${Date.now()}.${fileExtension}`;
            imageUrl = await uploadCloud(fileName, req.files.imageUrl[0]);
        }

        if (req.files.videoUrl && req.files.videoUrl[0]) {
            const fileExtension = req.files.videoUrl[0].originalname.split('.').pop();
            const fileName = `video/${Date.now()}.${fileExtension}`;
            videoUrl = await uploadCloud(fileName, req.files.videoUrl[0]);
        }
    }


    const newMessage = new MessageModel({
        sender: authId,
        chat: _id,
        text: text || null,
        imageUrl: imageUrl || null,
        videoUrl: videoUrl || null,
    });

    
    const savedMessage = await newMessage.save();

    
    chat.latestMessage = savedMessage._id;
    await chat.save();

    
    const populatedMessage = await MessageModel.findById(savedMessage._id).populate('sender','-password').exec();

    return populatedMessage;
}



exports.editMessage = async (req) => {
    const { authId } = req;
    const { _id } = req.params;
    const { text } = req.body;

    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "Message ID is required" });
    }

    if (!text) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "Text content is required for editing the message." });
    }

    
    const message = await MessageModel.findById(_id);
    if (!message) {
        throw new ApiError(httpStatus.NOT_FOUND, { message: "Message not found" });
    }

    if (message.sender !== authId) {
        throw new ApiError(httpStatus.FORBIDDEN, { message: "You are not authorized to edit this message." });
    }

    
    if (req.files || req.file) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "Editing image or video is not allowed." });
    }

    
    const updatedMessage = await MessageModel.findByIdAndUpdate(
        _id,
        { $set: { text, updatedAt: new Date() } },
        { new: true }
    );

    return updatedMessage;
};


exports.deleteMessage = async (req) => {
    const { authId } = req;
    const { _id } = req.params;

    
    if (!_id) {
        throw new ApiError(httpStatus.BAD_REQUEST, { message: "Message ID is required" });
    }

    
    const message = await MessageModel.findById(_id);
    if (!message) {
        throw new ApiError(httpStatus.NOT_FOUND, { message: "Message not found" });
    }

    
    if (message.sender !== authId) {
        throw new ApiError(httpStatus.FORBIDDEN, { message: "You are not authorized to delete this message." });
    }

    await MessageModel.findByIdAndDelete(_id);

    return { message: "Message deleted successfully" };
};

