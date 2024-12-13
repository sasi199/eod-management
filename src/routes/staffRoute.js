const express = require('express');
const staffController = require("../controller/staffController");
const uploads = require("../middlewares/multer");
const httpStatus = require('http-status');
const { verifyAuthToken } = require('../middlewares/jwt.config');
const { checkPermission } = require('../middlewares/permission');
const { permissionGroups } = require('../config/permissions');

const Router = express.Router();



// Router.use(verifyAuthToken); checkPermission(permissionGroups.adminManagement.create)

Router.route('/createStaff').post(verifyAuthToken,uploads.single('profilePic'),staffController.createStaff);
Router.route('/getStaffAll').get(staffController.getStaffAll);
Router.route('/getFilterStaff').get(staffController.getFilterStaff);
Router.route('/getStaffId/:_id').get(staffController.getStaffId);
Router.route('/editStaff/:_id').put(verifyAuthToken,uploads.single('profilePic'),staffController.editStaff);
Router.route('/deleteStaff/:_id').delete(staffController.deleteStaff);
Router.route('/staffCount').get(staffController.staffCount);
Router.route('/staffProfile').get(verifyAuthToken,staffController.staffProfile);

module.exports = Router;