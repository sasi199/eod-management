const express = require('express');
const assessmentController = require("../controller/assessmentController");
const { verifyAuthToken } = require('../middlewares/jwt.config');
const uploads = require('../middlewares/multer');


const Router = express.Router();
// Router.use(verifyAuthToken);

Router.route('/createAssessment').post(uploads.single('mediaUrl'),assessmentController.createAssessment);
Router.route('/getAssessmentAll').get(assessmentController.getAssessmentAll);
Router.route('/getAssessmentId/:_id').get(assessmentController.getAssessmentId);
Router.route('/editAssessment/:_id').put(uploads.single('mediaUrl'),assessmentController.editAssessment);
Router.route('/deleteAssessment/:_id').delete(assessmentController.deleteAssessment);

module.exports = Router;
