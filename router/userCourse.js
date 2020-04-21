const express = require("express");
const router = express.Router();

const {
  getCourses,
  postCourse,
  deleteCourse,
} = require("../controller/userCourse");

const { protect } = require("../middleware/auth");

router.get("/", protect, getCourses);
router.post("/", protect, postCourse);
router.delete("/:id", protect, deleteCourse);

module.exports = router;
