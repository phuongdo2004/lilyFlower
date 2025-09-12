const express = require("express");
const router = express.Router();
const controller = require("../../controllers/admin/role-permission.controller.js");

router.get("/" , controller.index);
router.patch("/" , controller.update);

module.exports = router;
