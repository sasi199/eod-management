const express = require('express');
const assessmentController = require("../controller/assessmentController");
const { verifyAuthToken } = require('../middlewares/jwt.config');


const Router = express.Router();
Router.use(verifyAuthToken);

Router.route('/createAssessment').post(assessmentController.createAssessment);

module.exports = Router;
