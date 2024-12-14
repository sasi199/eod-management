const chatSocketController = require("./controller");

module.exports = (socket, io) => {

    socket.on("joinRoom", (data) => {
        chatSocketController.joinRoom(socket, data);
    });

    socket.on("leaveRoom", (data) => {
        chatSocketController.leaveRoom(socket, data);
    });

    socket.on("sendMessage", (data) => {
        chatSocketController.sendMessage(socket, io, data);
    });

    socket.on("listeningChats", (data) => {
        chatSocketController.listeningChats(socket, data);
    });

    socket.on("leaveListeningChats", (data) => {
        chatSocketController.leaveListeningChats(socket, data);
    });

    socket.on("messageChange", (data) => {
        chatSocketController.messageChange(socket, io, data);
    });

    socket.on("startTypingInChat", (data) => {
        chatSocketController.startTypingInChat(socket, data);
    });

    socket.on("stopTypingInChat", (data) => {
        chatSocketController.stopTypingInChat(socket, data);
    });

    socket.on("newChat", () => {
        chatSocketController.newChat(socket)
    })

    socket.on("ringTheRoom", (data) => {
        chatSocketController.ringTheRoom(socket, io, data);
    });

    socket.on("webrtc_offer", (data) => {       
        chatSocketController.webrtc_offer(socket, io, data);
    });

    socket.on("webrtc_answer", (data) => {
        chatSocketController.webrtc_answer(socket, io, data);
    });

    socket.on("webrtc_ice_candidate", (data) => {
        chatSocketController.webrtc_ice_candidate(socket, io, data);
    });

    socket.on("endCall", (data) => {
        chatSocketController.endCall(socket, io, data);
    });

    socket.on("disconnect", () => {
        chatSocketController.disconnect(socket);
    });

};