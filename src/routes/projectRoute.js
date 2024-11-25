const express = require('express');
const projectController = require("../controller/projectController");


const Router = express.Router();

Router.route('/createProject').post(projectController.createProject);
Router.route('/getProjectAll').get(projectController.getProjectAll);
Router.route('/getProjectId/:_id').get(projectController.getProjectId);
Router.route('/editProject/:_id').put(projectController.editProject);
Router.route('/deleteProject/:_id').delete(projectController.deleteProject);

Router.route('/getTaskById/:projectId').get(projectController.getTaskByProject);

module.exports = Router;