const express = require("express");
const router = express.Router();

// Search Controller
const { searchCourses } = require("../controller/search");

router.get("/:query", searchCourses);

module.exports = router;
