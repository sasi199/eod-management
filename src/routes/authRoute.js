const express = require('express');
const auth = require("../controller/authController");
const { verifyAuthToken } = require('../middlewares/jwt.config');
const Router = express.Router();



Router.route('/login').post(auth.authLogin);
Router.route('/createAttendance').get(auth.createAttendance);
Router.route('/getAttendance').get(auth.getAttendance);
Router.route('/getTraineeAttendance').get(verifyAuthToken,auth.getTraineeAttendance);
Router.route('/editTraineeAttendance/:_id').put(verifyAuthToken,auth.editTraineeAttendance);
Router.route('/logout').post(verifyAuthToken,auth.logoutUser);

Router.route('/createAuth').post(auth.authCreation);


module.exports = Router;
