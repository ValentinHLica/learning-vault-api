const express = require("express");
const cors = require("./middleware/cors");
const connectDB = require("./config/connectDB");
const ErrorHandler = require("./middleware/ErrorHandler");

// const dotenv = require("dotenv");
// dotenv.config({ path: "./config/config.env" });

const app = express();
app.use(express.json());

// Connect to DB
connectDB();

// Enable Cors
app.use(cors);

// Routes
const searchCourses = require("./router/search");
const getCourse = require("./router/getCourse");
const auth = require("./router/auth");
const userCourses = require("./router/userCourse");

app.use("/search", searchCourses);
app.use("/course", getCourse);
app.use("/auth", auth);
app.use("/user/courses", userCourses);

// ErrorHandler
app.use(ErrorHandler);

app.listen(process.env.PORT, () => {
  if (process.env.STAGE === "dev") {
    console.log(`Server Runing at PORT: ${process.env.PORT}`);
  }
});
