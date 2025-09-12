const express = require("express");
const router = express.Router();
const multer = require("multer");
const uploadCloud = require("../../middlewares/admin/upLoadCloud.middleware");
require('dotenv').config();

// const upload = multer({ dest: 'uploads/' });
// Cấu hình Multer để lưu vào bộ nhớ
const storage = multer.memoryStorage();
const upload = multer({ storage: storage })
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
})
const controller = require("../../controllers/admin/account.controller");
router.get("/" ,controller.index);
router.get("/create" , controller.create);
router.post("/create"  ,upload.single('avatar') ,
uploadCloud.uploadSingle,
 controller.createPost);
router.patch("/change-status/:status/:id" ,controller.changeStatus);
router.get("/detail/:id" ,controller.detail);
router.get("/edit/:id" , controller.edit);
router.post("/edit/:id"  ,upload.single('avatar') ,
uploadCloud.uploadSingle,
 controller.editPost);
router.patch("/deleted/:id" , controller.deleted);

module.exports = router;
 
