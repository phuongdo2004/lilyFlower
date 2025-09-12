const controller = require("../../controllers/admin/order.controller.js");

const express = require("express");
const router = express.Router();
router.get("/" ,controller.index);
router.get("/detail/:id" , controller.detail);
router.patch("/changeStatus/:orderId" , controller.changeStatus);
router.delete("/deleted/:orderId" ,controller.deletedOrder);

module.exports = router;





