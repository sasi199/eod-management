const express = require('express');
const router = express.Router();
const chatController = require("../controller/chatController");
const uploads = require("../middlewares/multer");
const { verifyAuthToken } = require('../middlewares/jwt.config');


router.use(verifyAuthToken)

router
  .route("/")
  .get(chatController.getMembers)
  .post(chatController.createChats)


module.exports = router;