const express  = require('express');
const reportController = require("../controller/reportController");
const { verifyAuthToken } = require('../middlewares/jwt.config');

const Router = express.Router()

Router.route('/createReport').post(verifyAuthToken,reportController.createReport);
Router.route('/getReportAll').get(reportController.getReportAll);
Router.route('/getReportId').get(verifyAuthToken,reportController.getReportId);
Router.route('/editReport/:_id').put(reportController.editReport);
Router.route('/deleteReport/:_id').delete(reportController.deleteReport);

Router.route('/replayReport/:_id').post(reportController.replayReport);


module.exports = Router;