const express = require('express');
const chatController = require("../controller/chatController");
const uploads = require("../middlewares/multer");
const { verifyAuthToken } = require('../middlewares/jwt.config');

const Router = express.Router();
Router.use(verifyAuthToken)


Router.route('/createChat/:_id').post(chatController.createChat);
Router.route('/sendMessage/:_id').post(uploads.fields([
    { name: "imageUrl", maxCount: 1 },
    { name: "videoUrl", maxCount: 1 },]),chatController.sendMessage);

Router.route('/editMessage/:_id').post(uploads.single(''),chatController.editMessage);
Router.route('/deleteMessage/:_id').post(chatController.deleteMessage);



module.exports = Router;