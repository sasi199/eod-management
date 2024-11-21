const express = require('express');
const assessmentController = require("../controller/assessmentController");
const { verifyAuthToken } = require('../middlewares/jwt.config');


const Router = express.Router();
Router.use(verifyAuthToken);

Router.route('/createAssessment').post(assessmentController.createAssessment);
Router.route('/getAssessmentAll').get(assessmentController.getAssessmentAll);
Router.route('/getAssessmentId/:_id').get(assessmentController.getAssessmentId);
Router.route('/editAssessment/:_id').put(assessmentController.editAssessment);
Router.route('/deleteAssessment/:_id').delete(assessmentController.deleteAssessment);

module.exports = Router;
