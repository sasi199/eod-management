const express = require('express');
const batchController = require("../controller/batchController");
const uploads = require("../middlewares/multer");
const { verifyAuthToken } = require('../middlewares/jwt.config');
const { checkPermission } = require('../middlewares/permission');

const Router = express.Router();
// Router.use(verifyAuthToken)

Router.route('/createBatch').post(verifyAuthToken,checkPermission('batchCreate'),batchController.createBatch);
Router.route('/getBatchAll').get(batchController.getBatchAll);
Router.route('/getBatchId/:_id').get(batchController.getBatchId);
Router.route('/editBatch/:_id').put(batchController.editBatch);
Router.route('/deleteBatch/:_id').delete(batchController.deleteBatch);
Router.route('/batchCount').get(batchController.batchCount);


module.exports = Router;
