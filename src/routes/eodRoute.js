const express = require('express');
const eodController = require("../controller/eodController");
const uploads = require('../middlewares/multer');
const { verifyAuthToken } = require('../middlewares/jwt.config');


const Router = express.Router();

Router.route('/createEod').post(verifyAuthToken,uploads.fields([{ name: 'uploadFile', maxCount: 10 },]),eodController.createEod);
Router.route('/getEodAll').get(eodController.getEodAll);
Router.route('/getEodId').get(eodController.getEodById);
Router.route('/editEod').get(eodController.editEod);
Router.route('/deleteEod').get(eodController.deleteEod);

module.exports = Router;