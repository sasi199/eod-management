const express = require('express');
const eodController = require("../controller/eodController");
const uploads = require('../middlewares/multer');


const Router = express.Router();

Router.route('/createEod').post(uploads.fields([{ name: 'uploadfile', maxCount: 10 },]),eodController.createEod);

module.exports = Router;