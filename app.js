const express = require('express');
const cors = require('cors');
const {status} = require('http-status');
const http = require('http');
const morgan = require('./src/config/morgan');
const routes = require("./src/routes/index");
const { authLimiter } = require('./src/middlewares/rateLimiter');
const socketIo = require('socket.io');
const { errorConverter, errorHandler } = require('./src/middlewares/error');
const path = require('path');
const ApiError = require('./src/utils/apiError');



const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

// Set up EJS as the view engine

console.log(path.join(__dirname, 'src/views'),'sdsdsfdgcvfs')

app.set('view engine', 'ejs');
app.set('views', './src/views');

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
    console.log(req.headers)
    const data = {siteName : 'EOD Backend',message:null,siteLink:"http://localhost:5174"}
    res.status(200).render('siteWorking', data)
    // res.status(200).send({message:"EOD backend is working...🚀"})
})

app.use('/v1',routes);
app.use('/v1/auth',authLimiter);


// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(status.NOT_FOUND, "Not found"));
  });

app.use(errorConverter);

// handle error
app.use(errorHandler);


module.exports = server;

