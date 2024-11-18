const express = require('express');
const batchController = require("../controller/batchController");
const uploads = require("../middlewares/multer");
const { verifyAuthToken } = require('../middlewares/jwt.config');

const Router = express.Router();
Router.use(verifyAuthToken)

Router.route('/createBatch').post(batchController.createBatch);
Router.route('/getBatchAll').get(batchController.getBatchAll);
Router.route('/getBatchId').get(batchController.getBatchId);
Router.route('/editBatch').put(batchController.editBatch);
Router.route('/deleteBatch').delete(batchController.deleteBatch);


module.exports = Router;
