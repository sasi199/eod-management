const logger = require("../config/logger");
const ChatModel = require("../models/chatModel");
const MessageModel = require("../models/messageModel");

const socketUser = {};
const userRooms = {};
const userListening = {};
const webRTCRooms = {};


module.exports = {
  joinRoom: async (socket, room, userId) => {
    if (!socketUser[socket.id]) {
      socketUser[socket.id] = userId;
      logger.info(
        `Added userId ${userId} to socketUser for socket ${socket.id}`
      );
    }

    if (!userListening[userId]) {
      userListening[userId] = [];
      logger.info(`Created new listening array for userId ${userId}`);
    }

    if (!userListening[userId].includes(userId)) {
      userListening[userId].push(userId);
      logger.info(`Added userId ${userId} to userListening`);
    }

    if (userRooms[userId] && userRooms[userId].includes(room)) {
      logger.info(`User ${userId} is already in room ${room}`);
      userRooms[userId] = userRooms[userId].filter((r) => r !== room);
    }
    socket.join(room);
    if (!userRooms[userId]) {
      userRooms[userId] = [];
    }
    userRooms[userId].push(room);

    const messageStatus = {
      roomId: room,
      userId: userId,
      status: "read",
      receivedTime: Date.now(),
    };

    Object.keys(userRooms).forEach((id) => {
      socket.to(id).emit("messageStatusForRoom", { messageStatus });
    });

    await Promise.all([
      ChatModel.updateOne(
        {
          "participants._id": userId,
          "messageStatus.status": "delivered",
          roomId: room,
        },
        {
          $set: {
            "messageStatus.$[elem].status": "read",
            "messageStatus.$[elem].receivedTime": Date.now(),
          },
        },
        {
          arrayFilters: [{ "elem.userId": userId }],
          multi: true,
        }
      ),
      MessageModel.updateMany(
        {
          "receiverId.userId": userId,
          "messageStatus.status": "delivered",
          roomId: room,
        },
        {
          $set: {
            "messageStatus.$[elem].status": "read",
            "messageStatus.$[elem].receivedTime": Date.now(),
          },
        },
        {
          arrayFilters: [{ "elem.userId": userId }],
          multi: true,
        }
      ),
    ]);

    logger.info(`Socket ${socket.id} (user ${userId}) joined room: ${room}`);
  },

  leaveRoom: (socket, room, userId) => {
    socket.leave(room);
    if (userRooms[userId]) {
      userRooms[userId] = userRooms[userId].filter((room) => room !== room);
      if (userRooms[userId].length === 0) {
        delete userRooms[userId];
      }
    }
    logger.info(`Socket ${socket.id} (user ${userId}) left room: ${room}`);
  },


  sendMessage: async (
    socket,
    io,
    {
      senderId,
      receiverId,
      message,
      roomId,
      senderName,
      tag,
      date,
      chat_id,
      time,
      profile,
      userId,
      messageType,
      groupType,
      createdBy
    }
  ) => {
    const room = roomId;

    // if (messageType === "file") {
    //   const folderName = `LMS/institute/chat/buffer`;
    //   let profileURL = await uploadFileToS3(message, folderName);
    // }

    const messageStatus = receiverId.map(({ userId: receiverId }) => {
      const isInRoom =
        userRooms[receiverId] && userRooms[receiverId].includes(roomId);
      const isListening = userListening[receiverId];

      if (isInRoom && isListening) {
        return { userId: receiverId, status: "read", receivedTime: Date.now() };
      } else if (isListening) {
        return {
          userId: receiverId,
          status: "delivered",
          receivedTime: Date.now(),
        };
      } else {
        return {
          userId: receiverId,
          status: "not delivered",
          receivedTime: Date.now(),
        };
      }
    });

    messageStatus.push({
      userId: userId,
      status: "read",
      receivedTime: Date.now(),
    });

    io.to(room).emit("message", {
      senderId,
      receiverId,
      message,
      roomId,
      tag,
      date,
      chat_id,
      time,
      senderName,
      profile,
      messageType,
      messageStatus,
      groupType,
      createdBy
    });

    const data = {
      senderId,
      receiverId,
      profile,
      roomId,
      message,
      senderName,
      tag,
      date,
      chat_id,
      time,
      messageType,
      messageStatus,
      groupType,
      createdBy
    };



    const saveMessage = MessageModel.create(data);

    const matchingUserIds = Object.keys(userRooms).filter((userId) =>
      userRooms[userId].includes(roomId)
    );

    const updateGroup = ChatModel.updateOne({ roomId }, [
      {
        $set: {
          lastMessage: data.message,
          messageTime: data.time,
          messageStatus: data.messageStatus,
          lastMessageUserId: userId,
          count: {
            $map: {
              input: "$count",
              as: "item",
              in: {
                userId: "$$item.userId",
                count: {
                  $cond: {
                    if: { $in: ["$$item.userId", matchingUserIds] },
                    then: 0,
                    else: { $add: ["$$item.count", 1] },
                  },
                },
              },
            },
          },
        },
      },
    ]);

    await Promise.all([
      saveMessage,
      updateGroup
    ])
  },

  listeningChats: async (socket, userId) => {
    const existingSocketId = Object.keys(socketUser).find(
      (key) => socketUser[key] === userId
    );
    if (existingSocketId) {
      delete socketUser[existingSocketId];
      socket.leave(userId);
    }

    socketUser[socket.id] = userId;

    if (userListening[userId]) {
      const index = userListening[userId].indexOf(userId);
      if (index !== -1) {
        userListening[userId].splice(index, 1);
      }
    } else {
      userListening[userId] = [];
    }

    userListening[userId].push(userId);

    socket.join(userId);

    if (!userListening[userId]) {
      userListening[userId] = [];
    }

    if (!userListening[userId].includes(userId)) {
      userListening[userId].push(userId);
    }

    userListening[userId].push(userId);
    const onlineUsers = Object.keys(userListening).map((id) => ({
      userId: id,
    }));

    const messageStatus = Object.keys(userListening).map((id) => ({
      userId: id,
      status: "delivered",
      receivedTime: Date.now(),
    }));

    Object.keys(userListening).forEach((id) => {
      socket.to(id).emit("messageStatus", { messageStatus });
    });

    socket.emit("onlineUsers", { onlineUsers });
    socket.broadcast.emit("onlineUsers", { onlineUsers });




    await Promise.all([
      ChatModel.updateMany(
        { "participants._id": userId, "messageStatus.status": "not delivered" },
        {
          $set: {
            "messageStatus.$[elem].status": "delivered",
            "messageStatus.$[elem].receivedTime": Date.now(),
          },
        },
        {
          arrayFilters: [{ "elem.userId": userId }],
          multi: true,
        }
      ),
      MessageModel.updateMany(
        {
          "receiverId.userId": userId,
          "messageStatus.status": "not delivered",
        },
        {
          $set: {
            "messageStatus.$[elem].status": "delivered",
            "messageStatus.$[elem].receivedTime": Date.now(),
          },
        },
        {
          arrayFilters: [{ "elem.userId": userId }],
          multi: true,
        }
      ),
    ]);

    logger.info(`Socket ${socket.id} listening chats for: ${userId}`);
  },

  leaveListeningChats: (socket, userId) => {
    socket.leave(userId);
    if (userListening[userId]) {
      userListening[userId] = userListening[userId].filter(
        (id) => id !== userId
      );
      if (userListening[userId].length === 0) {
        delete userListening[userId];
      }
    }
    const onlineUsers = Object.keys(userListening).map((id) => ({
      userId: id,
    }));
    socket.emit("onlineUsers", { onlineUsers });
    socket.broadcast.emit("onlineUsers", { onlineUsers });
    logger.info(
      `Socket ${socket.id} stopped listening for chats for: ${userId}`
    );
  },

  messageChange: async (socket, io, { participantIds }) => {
    const updatedParticipants = participantIds.map((participant) => {
      const roomId = userRooms[participant.userId]?.[0];
      const updatedCount =
        roomId === participant.roomId ? 0 : parseInt(participant.count, 10) + 1;

      return {
        ...participant,
        count: updatedCount,
      };
    });
    const usersCountMap = updatedParticipants.reduce((map, participant) => {
      if (!map[participant.roomId]) {
        map[participant.roomId] = [];
      }
      map[participant.roomId].push({
        userId: participant.userId,
        count: participant.count,
      });
      return map;
    }, {});

    updatedParticipants.forEach((participant) => {
      const { userId, ...data } = participant;
      const usersCount = usersCountMap[participant.roomId] || [];

      io.to(userId).emit("membersData", {
        ...data,
        usersCount,
      });
    });
  },

  startTypingInChat: (socket, { participantData }) => {
    participantData.forEach((chatTyping) => {
      const { userId, ...data } = chatTyping;
      socket.to(userId).emit("typingInChat", data);
    });
  },

  stopTypingInChat: (socket, { participantData }) => {
    participantData.forEach((chatTyping) => {
      const { userId, ...data } = chatTyping;
      socket.to(userId).emit("stopTypingInChat", data);
    });
  },

  ringTheRoom: (socket, io, roomId, userId, callId, callType, participants ) => {
    const initiator = userId;
    // const participants = participantsUserId.filter(p => p._id !== userId).map(p => ({ ...p })); 

    webRTCRooms[roomId] = {
      callId,
      initiator,
      participants
    };
    participants.forEach(({ _id : participantId }) => {
      io.to(participantId).emit("receivingCall", { userId, roomId, initiator, callType, participants });
    });

    logger.info(
      `User ${userId} initiated a call in room ${roomId} with callId ${callId}`
    );
    const timeoutDuration = 30000;
    setTimeout(() => {
      if (webRTCRooms[roomId]) {
        delete webRTCRooms[roomId];
        participants.forEach(({ _id: participantId }) => {
          io.to(participantId).emit("callEnded", { userId, callId, roomId, reason: "timeout" });
        });

        io.to(userId).emit("callEnded", { userId, callId, roomId, reason: "timeout" });
        logger.info(`Call with id ${callId} in room ${roomId} ended due to timeout`);
      }
    }, timeoutDuration);
  },

  webrtc_offer: (socket, io, sdp, roomId) => {
    const { participants } = webRTCRooms[roomId] || {};
    if (participants) {
      participants.forEach(({ _id: participantId }) => {
        io.to(participantId).emit("webrtc_offer", {
          sdp,
          roomId,
        });
      });

      logger.info(`WebRTC offer sent for room ${roomId}`);
    }
  },

  webrtc_answer: (socket, io, sdp, roomId) => {
    const room = webRTCRooms[roomId];
    if (room && room.initiator) {
      io.to(room.initiator).emit("webrtc_answer", {
        sdp,
        roomId,
      });

      logger.info(`WebRTC answer received for room ${roomId}`);
    }
  },

  webrtc_ice_candidate: (socket, io, candidate, roomId) => {
    const { participants, initiator } = webRTCRooms[roomId] || {};
    if (participants) {
      participants.forEach(({ _id: participantId }) => {
        io.to(participantId).emit("webrtc_ice_candidate", {
          candidate,
          roomId,
        });
      });
    }

    if (initiator) {
      io.to(initiator).emit("webrtc_ice_candidate", {
        candidate,
        roomId,
      });
    }

    logger.info(`ICE candidate exchanged for room ${roomId}`);
  },


  endCall: (socket, io, roomId, reason = "ended") => {
    const room = webRTCRooms[roomId];

    if (room) {
      const { participants, initiator } = room;
        
      participants.forEach(({ _id: participantId }) => {
        io.to(participantId).emit("callEnded", { participants, roomId, reason });
      });

      if (initiator) {
        io.to(initiator).emit("callEnded", {
          participants,
          roomId,
          reason,
        });
      }

      delete webRTCRooms[roomId];
      logger.info(`Call in room ${roomId} ended due to ${reason}`);
    }
  },


  disconnect: (socket) => {
    const userId = socketUser[socket.id];

    if (userId) {
      delete socketUser[userId];

      if (userRooms[userId]) {
        delete userRooms[userId];
      }

      if (userListening[userId]) {
        delete userListening[userId];
      }

      if (webRTCRooms[userId]) {
        delete webRTCRooms[userId];
      }

      logger.info(`Cleaned up data for user ${userId}`);
    } else {
      logger.info("User ID not found for socket:", socket.id);
    }
  },
  socketData: () => {
    return { socketUser, userRooms, userListening, webRTCRooms }
  },

};