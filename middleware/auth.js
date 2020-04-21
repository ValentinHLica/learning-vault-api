const User = require("../models/user");
const jwt = require("jsonwebtoken");

exports.protect = async (req, res, next) => {
  try {
    let token;

    const auth = req.headers.authorization;

    if (auth && auth.startsWith("Bearer")) {
      token = auth.split(" ")[1];
    }

    if (!token) {
      return next({
        name: "CostumError",
        message: "User is not Authorized",
        statusCode: 403,
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);

    next();
  } catch (error) {
    next(error);
  }
};
