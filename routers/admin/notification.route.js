const controller = require("../../controllers/admin/notification.controller.js");

const express = require("express");
const router = express.Router();
router.get("/" ,controller.index);


module.exports = router;
