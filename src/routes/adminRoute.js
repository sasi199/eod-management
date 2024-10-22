const express = require('express');
const adminController = require("../controller/adminController");

const Router = express.Router();



//admin
Router.route('/login').post(adminController.adminLogin);


module.exports = Router;