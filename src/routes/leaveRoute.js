const express = require('express');
const leaveController = require("../controller/leaveController");
const { verifyAuthToken } = require('../middlewares/jwt.config');


const Router = express.Router();

Router.route('/applyLeave').post(verifyAuthToken,leaveController.applyLeaveRequset);
Router.route('/approveLeave/:_id').put(leaveController.approveLeave);

module.exports = Router;