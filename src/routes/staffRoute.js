const express = require('express');
const staffController = require("../controller/staffController");
const uploads = require("../middlewares/multer");
const httpStatus = require('http-status');
const { verifyAuthToken } = require('../middlewares/jwt.config');

const Router = express.Router();

const checkSuperAdmin = (req,res,next)=>{
    if (req.user.role !== 'superAdmin') {
        return res.status(httpStatus.FORBIDDEN).json({ message: "Only super admins can perform this action" });
    }
    next();
}

Router.use(verifyAuthToken);

Router.route('/createStaff').post(checkSuperAdmin,uploads.single('profilePic'),staffController.createStaff);

module.exports = Router;