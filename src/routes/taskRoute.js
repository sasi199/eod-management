const express = require('express');
const taskController = require("../controller/taskController");
const uploads = require("../middlewares/multer");

const Router = express.Router();

Router.route("/createTask").post(taskController.createTask);


module.exports = Router;

