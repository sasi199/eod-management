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
Router.use(verifyAuthToken)
//admin
Router.route('/createAdmin').post(checkSuperAdmin,uploads.single('profilePic'),adminController.createAdmin);
Router.route('/getAdmin').get(adminController.getAdminAll);
Router.route('/getAdminId').get(adminController.getAdminById);
Router.route('/editAdmin').put(uploads.single('profilePic'),adminController.editAdmin);
Router.route('/deleteAdmin').delete(adminController.deleteAdmin);


module.exports = Router;