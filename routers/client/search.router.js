const  controller = require("../../controllers/client/search.controller");

const express = require("express");

const router = express.Router();
router.get("/" , controller.index);
router.get("/:type" , controller.indexSuggest);
module.exports = router;

