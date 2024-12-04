const express = require('express');
const eodController = require("../controller/eodController");
const uploads = require('../middlewares/multer');
const { verifyAuthToken } = require('../middlewares/jwt.config');


const Router = express.Router();

Router.route('/createEod').post(verifyAuthToken,uploads.fields([{ name: 'uploadFile', maxCount: 10 },]),eodController.createEod);

module.exports = Router;