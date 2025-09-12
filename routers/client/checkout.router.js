const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/prepareBuys.controller");

router.get("/" , controller.index);
// router.get("/:productId" , controller.index2);
router.post("/changeAddress" , controller.changeAddress);
router.post("/order" , controller.order);
router.get("/order/success" , controller.success);
module.exports = router;




