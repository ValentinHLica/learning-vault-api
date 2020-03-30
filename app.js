const express = require("express");
const cors = require("./middleware/cors");

const PORT = process.env.PORT || 5000;
const app = express();
app.use(express.json());

// Enable Cors
app.use(cors);

// Routes
const searchCourses = require("./router/search");
const getCourse = require("./router/getCourse");

app.use("/search", searchCourses);
app.use("/course", getCourse);

app.listen(PORT, () => {
  console.log(`Server Runing at PORT: ${PORT}`);
});
