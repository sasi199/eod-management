const mongoose = require('mongoose');
const server = require("./app");
const config = require("./src/config/config");
const logger = require("./src/config/logger");
require('./src/utils/devLogger');

const jsonConfig = require('./src/config/json.config')


mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    logger.info("Connected to MongoDB");
    server.listen(config.port,() =>{
        logger.info(`Listening to port ${config.port}`);
    });
});


const exitHandler = () =>{
    if (server) {
        server.close(() => {
            logger.info("Server closed");
            process.exit(1);
        });
    }else{
        process.exit(1)
    }
};


const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
}

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM",() => {
    logger.info("SIGTERM Received");
    if (server) {
        jsonConfig.saveDataToFile()
        server.close();
    }
});