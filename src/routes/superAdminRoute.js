const express = require('express');
const superAdmin = require("../controller/superAdminController");
const { verifyAuthToken } = require('../middlewares/jwt.config');
const adminController = require('../controller/adminController')
const Router = express.Router();



//admin
Router.route('/login').post(superAdmin.superAdminLogin);

Router.route('/createAdmin').post(verifyAuthToken,adminController.createAdmin);
module.exports = Router;