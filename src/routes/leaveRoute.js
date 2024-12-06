const express = require('express');
const leaveController = require("../controller/leaveController");
const { verifyAuthToken } = require('../middlewares/jwt.config');


const Router = express.Router();

Router.route('/applyLeave').post(verifyAuthToken,leaveController.applyLeaveRequset);

module.exports = Router;