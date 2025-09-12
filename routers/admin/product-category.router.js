const express = require("express");
const multer = require("multer");
const router  = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const uploadCloud = require("../../middlewares/admin/upLoadCloud.middleware");




const controller = require("../../controllers/admin/product-category.controller");
router.get("/", controller.index);
router.get("/add" , controller.create);
router.post("/add" ,
  upload.single('thumbnail'),uploadCloud.uploadSingle,

  controller.createPost);
router.patch("/changePosition/:id" , controller.changePositon);
router.patch("/change-status/:status/:id" , controller.changeStatus);
router.get("/detail/:id" , controller.detail);
router.get("/edit/:id" , controller.edit);
router.patch("/edit/:id" ,upload.single('thumbnail'),uploadCloud.uploadSingle  
, controller.editPatch);
router.patch("/delete/:id" , controller.deleted);







module.exports = router;






