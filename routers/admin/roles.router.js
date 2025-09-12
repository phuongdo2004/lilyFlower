const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/roles.controller");


router.get("/" , controller.index);
router.get("/create" , controller.create);
router.post("/create" , controller.createPost);
router.get("/detail/:id" , controller.detail);
router.get("/edit/:id" ,  controller.edit);
router.post("/edit/:id" ,  controller.editPost);
router.patch("/deleted/:id" , controller.deleted);


module.exports = router ;
