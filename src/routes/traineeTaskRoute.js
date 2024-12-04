const express = require('express');
const traineeTaskComtroller = require("../controller/traineeTaskController");
const uploads = require("../middlewares/multer");
const { verifyAuthToken } = require('../middlewares/jwt.config');

const Router = express.Router();

Router.route("/createTraineeTask").post(verifyAuthToken,traineeTaskComtroller.createTraineeTask);
Router.route("/getTraineeTaskAll").get(traineeTaskComtroller.getTraineeTaskAll);
Router.route("/getTraineeTaskId/:_id").get(traineeTaskComtroller.getTraineeTaskId);
Router.route("/editTraineeTask/:_id").put(traineeTaskComtroller.editTraineeTask);
Router.route("/deleteTraineeTask/:_id").delete(traineeTaskComtroller.deleteTraineeTask);

Router.route("/getTraineeTask").get(verifyAuthToken,traineeTaskComtroller.getTraineeTask);

Router.route("/updateTraineeStatus/:_id").put(verifyAuthToken,traineeTaskComtroller.updateTraineeStatus);

module.exports = Router;

