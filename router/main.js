const express = require("express");
const router = express.Router();

const { main } = require("../controller/main");

router.get("/", main);

module.exports = router;
