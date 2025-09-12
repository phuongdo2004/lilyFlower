const controller = require("../../controllers/admin/chat.controller.js");
const express = require("express");
const router = express.Router();
router.get("/" ,controller.index);
router.get("/detail/:idRoomchat" , controller.detail);

module.exports = router;
