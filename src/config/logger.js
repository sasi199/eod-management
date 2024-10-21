const winston = require('winston');

const enumerateErrorFoemat = winston.format((info)=>{
    if (info instanceof Error) {
        Object.assign(info,{ message: info.stack });
    }
    return info;
});


const logger = winston.createLogger({
    level: "info",
    format: winston.format.combine(
        enumerateErrorFoemat(),
        winston.format.colorize(),
        winston.format.splat(),
        winston.format.printf(({ level, message})=> `${level}: ${message}`)
    ),
    transports:[
        new winston.transports.Console({
            stderrLevels: ["error"]
        }),
    ],
});


module.exports = logger;