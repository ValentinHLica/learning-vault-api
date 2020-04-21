const mongoose = require("mongoose");

const UserCourseSchema = new mongoose.Schema({
  cover: {
    type: String,
    required: [true, "Course must have a cover"],
  },
  title: {
    type: String,
    required: [true, "Course must have a title"],
  },
  source: {
    type: String,
    required: [true, "Course must have a source name"],
  },
  link: {
    type: String,
    required: [true, "Course must have a url"],
  },
  status: {
    type: String,
    enum: ["watching", "bookmark"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: [true, "Course must have user id"],
    select: false,
  },
});

module.exports = mongoose.model("UserCourse", UserCourseSchema);
