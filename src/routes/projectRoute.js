const express = require('express');
const projectController = require("../controller/projectController");
const { verifyAuthToken } = require('../middlewares/jwt.config');


const Router = express.Router();

Router.route('/createProject').post(verifyAuthToken,projectController.createProject);
Router.route('/getProjectAll').get(projectController.getProjectAll);
Router.route('/getProject').get(projectController.getProject);
Router.route('/getProjectId').get(verifyAuthToken,projectController.getProjectId);
Router.route('/editProject/:_id').put(verifyAuthToken,projectController.editProject);
Router.route('/deleteProject/:_id').delete(verifyAuthToken,projectController.deleteProject);

Router.route('/getTaskById/:_id').get(projectController.getTaskByProject);

module.exports = Router;