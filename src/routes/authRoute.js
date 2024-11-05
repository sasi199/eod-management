const express = require('express');
const auth = require("../controller/authController");
const Router = express.Router();



Router.route('/login').post(auth.authLogin);


module.exports = Router;
