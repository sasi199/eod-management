const express = require('express');
const cors = require('cors');
const httpStatus = require('http-status');
const http = require('http');
const morgan = require('./src/config/morgan');
const routes = require("./src/routes/index");
const { authLimiter } = require('./src/middlewares/rateLimiter');
const socketIo = require('socket.io');



const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use(cors());
app.options("*", cors());

const server = http.createServer(app);
const io = socketIo(server,{
    cors: {
        origin: "*",
        methods: ["GET", "POST","PUT", "DELETE"],
        credentials: true
      },
})

app.use((req, res, next) => {
    req.io = io;
    next();
  });

  io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
        req.io.connectedUsers[userId] = socket.id;
    }

    socket.on("disconnect", () => {
        delete req.io.connectedUsers[userId];
    });
});


app.get("/",(req, res)=>{
    res.status(200).send({message:"EOD backend is working...🚀"})
})

app.use('/v1',routes);
app.use('/v1/auth',authLimiter);



module.exports = server;

