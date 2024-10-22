const express = require('express');
const adminController = require("../controller/adminController");

const Router = express.Router();



//admin
Router.post('/login',adminController.adminLogin);