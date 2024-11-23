const express = require('express');
const scheduleController = require("../controller/scheduleController");
const { verifyAuthToken } = require('../middlewares/jwt.config');


const Router = express.Router();

Router.use(verifyAuthToken)

Router.route('/createSchedule').post(scheduleController.createSchedule);
Router.route('/getScheduleAll').get(scheduleController.getScheduleAll);
Router.route('/getScheduleId:_id').get(scheduleController.getScheduleId);
Router.route('/editSchedule/:_id').put(scheduleController.editSchedule);
Router.route('/deleteSchedule/:_id').delete(scheduleController.deleteSchedule);


module.exports = Router;