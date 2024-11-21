const express = require('express');
const scheduleController = require("../controller/scheduleController");
const { verifyAuthToken } = require('../middlewares/jwt.config');


const Router = express.Router();

Router.use(verifyAuthToken)

Router.route('/createSchedule').post(scheduleController.createSchedule);


module.exports = Router;