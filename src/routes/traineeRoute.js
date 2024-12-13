const express = require('express');
const traineeController = require("../controller/traineeController");
const uploads = require("../middlewares/multer");
const { verifyAuthToken } = require('../middlewares/jwt.config');
const httpStatus = require('http-status');
const { checkPermission } = require('../middlewares/permission');

const Router = express.Router();

// Router.use(verifyAuthToken);


Router.route('/createTrainee').post(verifyAuthToken,checkPermission('batchCreate'),uploads.single('profilePic'),traineeController.createTrainee);
Router.route('/getTraineeAll').get(traineeController.getTraineeAll);
Router.route('/getTraineeId/:_id').get(traineeController.getTraineeId);
Router.route('/editTrainee/:_id').put(uploads.single('profilePic'),traineeController.editTrainee);
Router.route('/deleteTrainee/:_id').delete(traineeController.deleteTrainee);
Router.route('/traineeCount').get(traineeController.traineeCount);
Router.route('/traineeProfile').get(verifyAuthToken,traineeController.traineeProfile);


module.exports = Router;