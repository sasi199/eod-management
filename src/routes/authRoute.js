const express = require('express');
const auth = require("../controller/authController");
const { verifyAuthToken } = require('../middlewares/jwt.config');
const Router = express.Router();



Router.route('/login').post(auth.authLogin);
Router.route('/getAttendance').get(auth.getAttendance);
Router.route('/logout').post(verifyAuthToken,auth.logoutUser);

Router.route('/createAuth').post(auth.authCreation);


module.exports = Router;
