const express = require('express');
const trainerController = require('../controller/trainerController');
const uploads = require('../middlewares/multer');
const { verifyAuthToken } = require('../middlewares/jwt.config');
const Router = express.Router();


//SuperAdminCheck

const checkSuperAdmin = (req,res,next)=>{
    if(req.user.role !== 'SuperAdmin'){
        return res.status(httpStatus.FORBIDDEN).json({ message: "Only super admins can perform this action" });
    }
    next();
}

Router.use(verifyAuthToken)

//admin
Router.route('/createTrainer').post(checkSuperAdmin,uploads.single('profilePic'),trainerController.createTrainer);
Router.route('/getTrainers').get(trainerController.getTrainerAll);
Router.route('/getTrainerId').get(trainerController.getTrainerById);
Router.route('/editTrainer').put(uploads.single('profilePic'),trainerController.editTrainer);
Router.route('/deleteTrainer').delete(trainerController.deleteTrainer);


module.exports = Router;