const express = require('express');
const traineeController = require("../controller/traineeController");
const uploads = require("../middlewares/multer");
const { verifyAuthToken } = require('../middlewares/jwt.config');

const Router = express.Router();

const checkSuperAdmin = (req,res,next)=>{
    if(req.user.role !== 'SuperAdmin'){
        return res.status(httpStatus.FORBIDDEN).json({ message: "Only super admins can perform this action" });
    }
    next();
}

Router.use(verifyAuthToken);


Router.route('/createTrainee').post(checkSuperAdmin,uploads.fields([
    {name:'profilePic', maxCount:1},
    {name:'resumeUpload', maxCount:1}]),traineeController.createTrainee);

Router.route('/getTraineeAll').get(traineeController.getTraineeAll);
Router.route('/getTraineeId/:_id').get(traineeController.getTraineeId);
Router.route('/editTrainee/:traineeId').put(uploads.single('profilePic'),traineeController.editTrainee);
Router.route('/deleteTrainee/:_id').delete(traineeController.deleteTrainee);


module.exports = Router;