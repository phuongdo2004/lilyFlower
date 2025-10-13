const express = require("express");
const router = express.Router();
const controller = require("../../controllers/client/prepareBuys.controller");
const controllerPayment = require("../../controllers/client/payment.controller");
router.get("/" , controller.index);
router.post("/changeAddress" , ( req, res , next)=>{
  console.log("chayj vao ");
  next();
}
,controller.changeAddress);
router.get("/order/success" , controller.success);
router.post("/saveChoosen", controller.saveChoosen);
router.post("/payment" ,controllerPayment.payment );
// router.post("/callback" , controllerPayment.paymentCallback);

module.exports = router;




