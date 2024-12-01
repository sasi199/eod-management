const express = require('express');
const traineeTaskComtroller = require("../controller/traineeTaskController");
const uploads = require("../middlewares/multer");

const Router = express.Router();

Router.route("/createTraineeTask").post(traineeTaskComtroller.createTraineeTask);
Router.route("/getTraineeTaskAll").get(traineeTaskComtroller.getTraineeTaskAll);
Router.route("/getTraineeTaskId/:_id").get(traineeTaskComtroller.getTraineeTaskId);
Router.route("/editTraineeTask/:_id").put(traineeTaskComtroller.editTraineeTask);
Router.route("/deleteTraineeTask/:_id").delete(traineeTaskComtroller.deleteTraineeTask);

module.exports = Router;

