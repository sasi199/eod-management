const express = require('express');
const studentAttendanceController = require("../controller/studentAttendanceController");
const uploads = require('../middlewares/multer');

const Router = express.Router();

Router.route('/getStudentAttendance/:_id').get(studentAttendanceController.getStudentAttendance);

module.exports = Router;