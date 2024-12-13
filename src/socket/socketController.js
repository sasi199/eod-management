const chatSocketService = require("./socketService");

module.exports = {

  joinRoom: (socket, { room, userId }) => {
    chatSocketService.joinRoom(socket, room, userId);
  },

  leaveRoom: (socket, { room, userId }) => {
    chatSocketService.leaveRoom(socket, room, userId);
  },

  sendMessage: async (socket, io, messageData) => {
    await chatSocketService.sendMessage(socket, io, messageData);
  },

  listeningChats: async (socket, { userId }) => {
    chatSocketService.listeningChats(socket, userId);
  },

  leaveListeningChats: async (socket, { userId }) => {
    chatSocketService.leaveListeningChats(socket, userId);
  },

  messageChange: async (socket, io, changeData) => {
    await chatSocketService.messageChange(socket, io, changeData);
  },

  startTypingInChat: (socket, participantData) => {
    chatSocketService.startTypingInChat(socket, participantData);
  },

  stopTypingInChat: (socket, participantData) => {
    chatSocketService.stopTypingInChat(socket, participantData);
  },

  ringTheRoom: (socket, io, { roomId, userId, callId, callType, participants }) => {
    chatSocketService.ringTheRoom(socket, io, roomId, userId, callId, callType, participants);
  },

  webrtc_offer: (socket, io, { sdp, roomId }) => {
    chatSocketService.webrtc_offer(socket, io, sdp, roomId);
  },

  webrtc_answer: (socket, io, { sdp, roomId }) => {
    chatSocketService.webrtc_answer(socket, io, sdp, roomId);
  },

  webrtc_ice_candidate: (socket, io, { candidate, roomId }) => {
    chatSocketService.webrtc_ice_candidate(socket, io, candidate, roomId);
  },

  endCall: (socket, io, { roomId }) => {
    chatSocketService.endCall(socket, io, roomId);
  },

  disconnect: (socket) => {
    chatSocketService.disconnect(socket);
  },
};
