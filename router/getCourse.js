const express = require("express");
const router = express.Router();

// getCourse Controller
const { getCourse } = require("../controller/getCourse");

router.get("/:course", getCourse);

module.exports = router;
