const express = require('express');
const auth = require("../controller/authController");
const Router = express.Router();



Router.route('/login').post(auth.authLogin);

Router.route('/createAuth').post(auth.authCreation);


module.exports = Router;
