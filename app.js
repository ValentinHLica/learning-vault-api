const express = require("express");
const cors = require("./middleware/cors");
const connectDB = require("./config/connectDB");
const ErrorHandler = require("./middleware/ErrorHandler");

// Dev Only
const dotenv = require("dotenv");
dotenv.config({ path: "./config/config.env" });

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
const main = require("./router/main");

app.use("/search", searchCourses);
app.use("/course", getCourse);
app.use("/auth", auth);
app.use("/user/courses", userCourses);
app.use("/main", main);

// ErrorHandler
app.use(ErrorHandler);

app.listen(process.env.PORT);
