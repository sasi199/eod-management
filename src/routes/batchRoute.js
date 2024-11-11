const express = require('express');
const batchController = require("../controller/batchController");
const uploads = require("../middlewares/multer");
const { verifyAuthToken } = require('../middlewares/jwt.config');

const Router = express.Router();

Router.route('/createBatch').post(verifyAuthToken,batchController.createBatch);


module.exports = Router;
