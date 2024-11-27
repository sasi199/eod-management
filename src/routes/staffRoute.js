const express = require('express');
const staffController = require("../controller/staffController");
const uploads = require("../middlewares/multer");
const httpStatus = require('http-status');
const { verifyAuthToken } = require('../middlewares/jwt.config');

const Router = express.Router();

const checkSuperAdmin = (req,res,next)=>{
    if (req.user.role !== 'SuperAdmin') {
        console.error("Unauthorized access attempt by:", req.user.role);
        return res.status(httpStatus.FORBIDDEN).json({ message: "Only super admins can perform this action" });
    }

    next();
}

// Router.use(verifyAuthToken);

Router.route('/createStaff').post(verifyAuthToken,uploads.single('profilePic'),staffController.createStaff);
Router.route('/getStaffAll').get(staffController.getStaffAll);
Router.route('/getFilterStaff').get(staffController.getFilterStaff);
Router.route('/getStaffId/:_id').get(staffController.getStaffId);
Router.route('/editStaff/:_id').put(verifyAuthToken,uploads.single('profilePic'),staffController.editStaff);
Router.route('/deleteStaff/:_id').delete(staffController.deleteStaff);

module.exports = Router;