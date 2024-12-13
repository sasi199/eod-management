const express = require('express');
const router = express.Router();
const chatController = require("../controller/chatController");
const { verifyAuthToken } = require('../middlewares/jwt.config');


router.use(verifyAuthToken)

router
    .route("/")
    .get(chatController.getMembers)
    .post(chatController.createChats)

router.
    route("/message")
    .get(chatController.getMessaages);

module.exports = router;