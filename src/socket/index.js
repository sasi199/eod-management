const logger = require("../config/logger");
const chatSocketRoute = require("./socketRoute");


module.exports = (io) => {
    io.on("connection", (socket) => {
        logger.info(`Socket connected: ${socket.id}`);
        chatSocketRoute(socket, io);
        socket.on("disconnect", () => {
            logger.info(`Socket disconnected: ${socket.id}`);
        });
    });
};
