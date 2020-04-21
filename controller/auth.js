const User = require("../models/user");

// @desc       Register User
// @route      POST /auth/register
// @access     Public
exports.register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    sendSignedToken(res, user, 201);
  } catch (error) {
    next(error);
  }
};

// @desc       Login User
// @route      POST /auth/login
// @access     Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email && !password) {
      return next({
        message: "Please provide Login credentials",
        statusCode: 401,
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next({
        message: "Invalide Credentials",
        statusCode: 403,
      });
    }

    const matchPasswords = user.matchPasswords(password);

    if (!matchPasswords) {
      return next({
        message: "Invalide Credentials",
        statusCode: 403,
      });
    }

    sendSignedToken(res, user, 201);
  } catch (error) {
    next(error);
  }
};

const sendSignedToken = (res, user, statusCode) => {
  const token = user.getSignedToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};
