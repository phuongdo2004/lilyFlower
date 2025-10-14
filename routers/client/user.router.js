const express = require("express");
const multer = require("multer");
const storage = multer.memoryStorage();
const Auth = require("../../middlewares/client/auth.middleware");
 const uploadCloud = require("../../middlewares/admin/upLoadCloud.middleware");
 const upload = multer({ storage: storage });
const  controller = require("../../controllers/client/user.controller");

const router = express.Router();
router.post("/signin" ,(req , res , next)=>{
  console.log("chay vao sigin");
  next();
} , controller.signin);
router.post("/login" ,controller.login );
router.get("/logout" ,controller.logout );
router.get("/password/forgot" , controller.forgotPassword);
router.post("/password/forgot" , controller.forgotPasswordPost);
router.get("/password/otp" , controller.otpPassword);
router.post("/password/otp" , controller.otpPasswordPost);
router.get("/password/reset" , controller.resetPassword);
router.post("/password/reset" , controller.resetPasswordPost);


router.get("/order/all",(req , res , next)=>{console.log("okee"); next();}  , controller.ListOrder2);
router.get("/order/detail/:orderId" , controller.detailOrder);
router.get("/order" , controller.ListOrder);
router.get("/order/complete" ,controller.listOrderComplete);
router.get("/order/cancel" ,controller.listOrderCancel);
router.get("/edit/:userId" , controller.getInfor);
router.post("/edit/:userId"  , upload.single("avatar") ,uploadCloud.uploadSingle, controller.editInfor);
module.exports = router;

