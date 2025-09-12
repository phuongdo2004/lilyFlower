const express= require("express");
const controller = require("../../controllers/client/cart.controller");
const controllerPrepare = require("../../controllers/client/prepareBuys.controller");

const router = express.Router();
router.get("/" , controller.index);
router.post("/prepareBuy/:productId" , controllerPrepare.index);
router.post("/add/:productId" , controller.addPost);
router.get("/delete/:productId"  , controller.delete);
router.get("/update/:productId/:quantity" , controller.updateQuantity);
router.post("/add/buy/:productId" , controller.addPost2);

module.exports = router;
