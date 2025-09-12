const express = require("express");
const roomChatMiddle = require("../../middlewares/client/roomChat.middleware");

const chatController = require("../../controllers/client/chat.controller");
const router = express.Router();  

router.get("/",roomChatMiddle.findRoomChat , chatController.index);
module.exports = router;