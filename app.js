const express = require('express');
const cors = require('cors');
const httpStatus = require('http-status');
const http = require('http');
const morgan = require('./src/config/morgan');
const routes = require("./src/routes/index");
const { authLimiter } = require('./src/middlewares/rateLimiter');



const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use(cors());
app.options("*", cors());


const server = http.createServer(app);


app.get("/",(req, res)=>{
    res.status(200).send({message:"EOD backend is working...🚀"})
})

app.use('/v1',routes);
app.use('/v1/auth',authLimiter);



module.exports = server;

