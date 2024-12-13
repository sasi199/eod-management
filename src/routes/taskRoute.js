const express = require('express');
const taskController = require("../controller/taskController");
const uploads = require("../middlewares/multer");

const Router = express.Router();

Router.route("/createTask").post(taskController.createTask);
Router.route("/getTaskAll").get(taskController.getTaskAll);
Router.route("/getTaskId/:_id").get(taskController.gatTaskId);
Router.route("/editTask/:_id").put(taskController.editTask);
Router.route("/deleteTask/:_id").delete(taskController.deleteTask);

module.exports = Router;

