const logger = require("../config/logger");
// const authenticateSocket = require("../middleware/socketAuth"); 
const chatSocketRoute = require("./route");


module.exports = (io) => {
    // io.use(authenticateSocket);
    io.on("connection", (socket) => {
        logger.info(`Socket connected: ${socket.id}`);

        chatSocketRoute(socket, io);

        socket.on("disconnect", () => {
            logger.info(`Socket disconnected: ${socket.id}`);
        });
    });
};