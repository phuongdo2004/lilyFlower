const express =require("express");
const router = express.Router();
const controller = require("../../controllers/admin/products.controller.js");
const multer = require("multer");
const uploadCloud = require("../../middlewares/admin/upLoadCloud.middleware");
require('dotenv').config();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })

router.patch("/change-status/:status/:id" , controller.changeStatus);

router.get("/" , controller.index);
router.get("/add" ,controller.create);
router.post("/add" ,upload.single('thumbnail') ,
uploadCloud.uploadSingle,controller.addPost);

router.patch("/change-multi" , controller.changeMulti );
router.get("/detail/:id" , controller.detail);
router.get("/edit/:id" , controller.edit);
router.patch("/edit/:id" ,upload.single('thumbnail') ,
uploadCloud.uploadSingle , controller.editPatch);
router.patch("/delete/:id" , controller.deleted);
router.patch("/changePosition/:id" , controller.changePositon);

module.exports = router;

