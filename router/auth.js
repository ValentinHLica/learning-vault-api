const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  checkResetToken,
} = require("../controller/auth");

router.post("/register", register);
router.post("/login", login);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword/:token", resetPassword);
router.get("/checkresettoken/:token", checkResetToken);

module.exports = router;
