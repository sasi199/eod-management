const express  = require('express');
const reportController = require("../controller/reportController");


const Router = express.Router()

Router.route('/createReport/:_id').post(reportController.createReport);


module.exports = Router;