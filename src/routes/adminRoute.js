const express = require('express');
const adminController = require("../controller/adminController");
const { verifyAuthToken } = require('../middlewares/jwt.config');
const Router = express.Router();



//admin
Router.route('/createAdmin').post(verifyAuthToken,adminController.createAdmin);


module.exports = Router;