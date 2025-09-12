const express= require("express");
const router = express.Router();
const chatSocket = require("../../socket/client/chat.socket");

const controller = require("../../controllers/client/products.controller");

router.get("/" , controller.index);
router.get("/detail/:slug"  , controller.detail);
router.get("/category/:CategoryId" , controller.category);

module.exports = router;
