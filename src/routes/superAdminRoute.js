const express = require('express');
const superAdmin = require("../controller/superAdminController");
const Router = express.Router();



//admin
Router.route('/login').post(superAdmin.superAdminLogin);


module.exports = Router;