const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/contact.controller");

router.post("/contact" , controller.sendMessage );
module.exports = router;

