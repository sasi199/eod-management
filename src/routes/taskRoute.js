const express = require('express');
const taskController = require("../controller/taskController");
const uploads = require("../middlewares/multer");

const Router = express.Router();

Router.route("/createTask/:_id").post(taskController.createTask);
Router.route("/getTaskAll").get(taskController.getTaskAll);
Router.route("/getTaskId/:id").get(taskController.gatTaskId);
Router.route("/editTask/:id").put(taskController.editTask);
Router.route("/deleteTask/:id").delete(taskController.deleteTask);

module.exports = Router;

