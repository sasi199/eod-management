const express = require('express');
const adminController = require("../controller/adminController");
const { verifyAuthToken } = require('../middlewares/jwt.config');
const uploads = require('../middlewares/multer');
const Router = express.Router();


// SuperAdiminCheck
const checkSuperAdmin = (req,res,next)=>{
    if(req.user.role !== 'superAdmin'){
        return res.status(httpStatus.FORBIDDEN).json({ message: "Only super admins can perform this action" });
    }
    next();
}

//admin
Router.route('/createAdmin').post(verifyAuthToken,checkSuperAdmin,uploads.single('profilePic'),adminController.createAdmin);


module.exports = Router;