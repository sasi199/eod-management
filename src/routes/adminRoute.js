const express = require('express');
const adminController = require("../controller/adminController");
const { verifyAuthToken } = require('../middlewares/jwt.config');
const Router = express.Router();


// SuperAdiminCheck
const checkSuperAdmin = (req,res,next)=>{
    if(req.user.role !== 'superAdmin'){
        return res.status(httpStatus.FORBIDDEN).json({ message: "Only super admins can perform this action" });
    }
}

//admin
Router.route('/createAdmin').post(verifyAuthToken,adminController.createAdmin);


module.exports = Router;