const mongoose = require('mongoose');
const server = require("./app");
const config = require("./src/config/config");
const logger = require("./src/config/logger");
require('./src/utils/devLogger');

const jsonConfig = require('./src/config/json.config')


mongoose.connect(config.mongoose.url, config.mongoose.options).then(() => {
    logger.info("Connected to MongoDB");
    server.listen(config.port,() =>{
        jsonConfig.loadDataFromFile()
        logger.info(`Listening to port ${config.port}`);
    });
});


const exitHandler = () =>{
    if (server) {
        server.close(() => {
            logger.info("Server closed");
            jsonConfig.saveDataToFile()
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

// Attach a listener to save data on process exit (graceful shutdown/restart)
process.on('exit', () => {
    console.log('Process exiting, saving data...');
    jsonConfig.saveDataToFile(); // Save data when exiting
  });
  
  // You can also attach it to 'SIGINT' (Ctrl+C) or 'SIGUSR2' for a restart
  process.on('SIGINT', () => {
    console.log('Received SIGINT, saving data...');
    jsonConfig.saveDataToFile();
    process.exit();
  });
  
  process.on('SIGUSR2', () => {
    console.log('Received SIGUSR2, saving data...');
    jsonConfig.saveDataToFile();
    process.exit();
  });

process.on("uncaughtException", unexpectedErrorHandler);
process.on("unhandledRejection", unexpectedErrorHandler);

process.on("SIGTERM",() => {
    logger.info("SIGTERM Received");
    if (server) {
        jsonConfig.saveDataToFile()
        server.close();
    }
});