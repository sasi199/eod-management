const ChatModel = require("../models/chatModel");
const MessageModel = require("../models/messageModel");
const AuthModel = require("../models/authModel");
const ApiError = require("../utils/apiError");
const httpStatus = require('http-status');
const generateFolderId = require("../utils/generateId");
const moment = require("moment");


const getMembers = async (req) => {
    const user = req.user;
    let userId = user._id
    let project = {
        _id: 1,
        chatName: 1,
        type: 1,
        profile: 1,
        lastMessage: 1,
        lastMessageUserId: 1,
        roomId: 1,
        count: 1,
        messageTime: 1,
        participants: 1
    };
    const [val, getChat] = await Promise.all([
        AuthModel.aggregate([
            {
                $match: {
                    archive: false,
                    active: true
                }
            },
            {
                $lookup: {
                    from: "Role",
                    localField: "role",
                    foreignField: "_id",
                    as: "roleDetails"
                }
            },
            {
                $unwind: {
                    path: "$roleDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "Department",
                    localField: "department",
                    foreignField: "_id",
                    as: "departmentDetails"
                }
            },
            {
                $unwind: {
                    path: "$departmentDetails",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    email: 1,
                    userName: "$fullName",
                    profile: "$profilePic",
                    department: "$departmentDetails.name",
                    role: "$roleDetails.name"
                }
            }
        ]),
        ChatModel.find({ "participants._id": user._id }, project)
    ]);

    const data = getChat.map(chat => {
        if (chat.type === "individual") {
            const userChatName = chat.chatName.find(cn => cn.userId === userId)?.name || "";
            const userProfile = chat.profile.find(p => p.userId === userId)?.profile || "";
            const userCount = chat.count.find(c => c.userId === userId)?.count || 0;
    
            return {
                _id: chat._id,
                chatName: userChatName,
                type: chat.type,
                profile: userProfile,
                lastMessage: chat.lastMessage,
                lastMessageUserId: chat.lastMessageUserId,
                count: userCount,
                messageTime: chat.messageTime,
                participants: chat.participants,
                roomId: chat.roomId,
            };
        }
    
        if (chat.type === "group") {
            const userChatName = chat.chatName[0] || "";
            const userProfile = chat.profile[0] || "";
            const userCount = chat.count.find(c => c.userId === userId)?.count || 0;
    
            return {
                _id: chat._id,
                chatName: userChatName,
                type: chat.type,
                profile: userProfile,
                lastMessage: chat.lastMessage,
                lastMessageUserId: chat.lastMessageUserId,
                count: userCount,
                messageTime: chat.messageTime,
                participants: chat.participants,
                roomId: chat.roomId,
            };
        }
    
         return {
            _id: chat._id,
            chatName: "Unknown Chat Type",
            type: chat.type,
            profile: "",
            lastMessage: "",
            lastMessageUserId: "",
            count: 0,
            messageTime: "",
            participants: [],
            roomId: "",
        };
    });
    

    if (val.length === 0) throw new ApiError(httpStatus.status.NOT_FOUND, "Data Not Found.");
    return { val, data };
};



const createChats = async (req) => {
    let user = req.user;
    let { type, participants } = req.body;
    let dateFormat = moment(Date.now()).format("hh:mm A");
    participants.push({
        _id: user._id,
        userName: user.fullName,
        profile: user.profilePic || "",
        email: user.email,
        role: user.role,
        department: user.department
    });

    let folderId = generateFolderId(user.fullName);

    let chatData;

    if (type === "individual") {
        const [participant1, participant2] = participants;

        const existingChat = await ChatModel.findOne({
            type: "individual",
            "participants._id": { $all: [participant1._id, participant2._id] },
        });

        if (existingChat) {
            return { message: "Chat already exists", chat: existingChat };
        }

        chatData = {
            ...req.body,
            folderId,
            createdBy: user._id,
            participants,
            chatName: [
                { userId: participant1._id, name: participant2.userName },
                { userId: participant2._id, name: participant1.userName },
            ],
            profile: [
                { userId: participant1._id, profile: participant2.profile || "" },
                { userId: participant2._id, profile: participant1.profile || "" },
            ],
            messageTime: dateFormat,
            lastMessageUserId: user._id,
            lastMessage: `Hello from ${user.fullName}`,
            count: participants.map((participant) => ({
                userId: participant._id,
                count: 1,
            })),
        };

        const createChat = await ChatModel.create(chatData);

        const receiverIds = participants
            .filter(
                (participant) => participant._id.toString() !== user._id.toString(),
            )
            .map((participant) => participant._id);

        let messageData = {
            messageTime: dateFormat,
            message: `Chat initiated by ${user.fullName}`,
            messageType: "initial",
            senderId: user.adminId,
            receiverId: receiverIds,
            chat_id: createChat._id,
            roomId: createChat.roomId,
            profile: user.profile,
            groupType: "individual",
            createdBy: user._id,
        };

        await MessageModel.create(messageData);

        let projectData = {
            ...createChat._doc,
            count: 1,
            admin: false,
            usersCount: createChat.count,
            chatName: createChat.chatName.find(
                (chat) => chat.userId.toString() !== user._id.toString(),
            )?.name,
            profile: createChat.profile.find(
                (prof) => prof.userId.toString() !== user._id.toString(),
            )?.profile,
        };

        let {
            archive,
            active,
            instituteId,
            createdAt,
            updatedAt,
            __v,
            ...filteredProjectData
        } = projectData;
        //   sendNewChatToMicroservice(filteredProjectData);

        return createChat;
    }

    chatData = {
        ...req.body,
        folderId,
        createdBy: user._id,
        messageTime: dateFormat,
        lastMessageUserId: user._id,
        lastMessage: `Created by ${user.fullName}`,
        count: participants.map((participant) => ({
            userId: participant._id,
            count: 1,
        })),
        admins: [
            {
                _id: user._id,
                userName: user.fullName,
            },
        ],
        participants,
    };

    const createChat = await ChatModel.create(chatData);
    const receiverIds = participants
        .filter((participant) => participant._id.toString() !== user._id.toString())
        .map((participant) => participant._id);

    let messageData = {
        messageTime: dateFormat,
        message: `${user.fullName} created group "${req.body.chatName}"`,
        messageType: "initial",
        senderId: user.adminId,
        receiverId: receiverIds,
        chat_id: createChat._id,
        roomId: createChat.roomId,
        groupType: "group",
        createdBy: user._id,
    };

    await MessageModel.create(messageData);

    let projectData = {
        ...createChat._doc,
        count: 1,
        admin: false,
        usersCount: createChat.count,
        chatName: createChat.chatName[0],
        profile: createChat.profile.length > 0 ? createChat.profile[0] : "",
    };

    let {
        archive,
        active,
        instituteId,
        createdAt,
        updatedAt,
        __v,
        ...filteredProjectData
    } = projectData;
    // sendNewChatToMicroservice(filteredProjectData);
    return createChat;
};

const getMessaages = async (req) => {
    const { roomId } = req.query;
    const user = req.user;

    if (!roomId || !user || !user._id) {
        throw new ApiError(httpStatus.status.BAD_REQUEST, "Invalid Request Parameters");
    }

    const updateGroupCountPromise = ChatModel.updateOne(
        { roomId },
        {
            $set: {
                "count.$[elem].count": 0,
            },
        },
        {
            arrayFilters: [{ "elem.userId": user._id }],
        }
    );

    const findMessagesPromise = MessageModel.aggregate([{ $match: { roomId } }]);
    const [updateResult, findMessages] = await Promise.all([
        updateGroupCountPromise,
        findMessagesPromise,
    ]);

    if (!findMessages || findMessages.length === 0) {
        throw new ApiError(httpStatus.status.BAD_REQUEST, "No Messages Found");
    }

    return findMessages;

};


module.exports = {
    getMembers,
    createChats,
    getMessaages
};
