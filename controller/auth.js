const User = require("../models/user");
const ForgotPasswordMailer = require("../utils/forgotPassword");
const crypto = require("crypto");

// @desc       Register User
// @route      POST /auth/register
// @access     Public
exports.register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);

    const token = user.getSignedToken();
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, options).json({
      success: true,
      token,
    });
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
        name: "CostumError",
        message: "Please provide Login credentials",
        statusCode: 401,
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return next({
        name: "CostumError",
        message: "Invalide Credentials",
        statusCode: 403,
      });
    }

    const matchPasswords = await user.matchPasswords(password);

    if (!matchPasswords) {
      return next({
        name: "CostumError",
        message: "Invalide Credentials",
        statusCode: 403,
      });
    }

    const token = user.getSignedToken();
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, options).json({
      success: true,
      username: user.username,
      token,
    });
  } catch (error) {
    next(error);
  }
};

// @desc       Get User Detail
// @route      GET /auth/user
// @access     Private
exports.getUserDetail = async (req, res, next) => {
  try {
    const user = req.user;

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc       Forgot Password
// @route      POST /auth/forgotpassword
// @access     Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return next({
        name: "CostumError",
        message: "User does not exist",
        statusCode: 404,
      });
    }

    const forgotPasswordToken = user.forgotPasswordMethod();
    await user.save({ validateBeforeSave: false });

    await ForgotPasswordMailer({
      email,
      subject: "Reset Password",
      text: `
      Click the url below to reset password:
      ${process.env.SITE_URL}/#/resetpassword/${forgotPasswordToken} 
      `,
      html: `
      <div>
        <h2 style="text-align: center;">Learning Vault</h2>
        <p style="margin:20px auto;text-align: center;">Click the below button to change password</p>
        <div style="padding:20px;display:flex;flex-direction: column;">
          <a id="reset" style="padding: 10px 20px;color: white;text-decoration: none;font-size: 1.1em;background-color: #bd1111;margin:auto" href="${process.env.SITE_URL}/#/resetpassword/${forgotPasswordToken}">Reset Password</a>
        </div>
      </div>
      `,
    });

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// @desc       Reset Password
// @route      POST /auth/resetpassword/:token
// @access     Public
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {
        $gte: Date.now(),
      },
    });

    if (!user) {
      return next({
        name: "CostumError",
        message: "Invalide Token",
        statusCode: 400,
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    const token = user.getSignedToken();
    const options = {
      expires: new Date(
        Date.now() + process.env.COOKIE_EXPIRE * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
    };

    res.status(201).cookie("token", token, options).json({
      success: true,
      username: user.username,
      token,
    });
  } catch (error) {
    next();
  }
};

// @desc       Check if resetPassword token is valid
// @route      Get /auth/checkresettoken/:token
// @access     Public
exports.checkResetToken = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(req.params.token)
      .digest("hex");

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: {
        $gte: Date.now(),
      },
    });

    if (!user) {
      return next({
        name: "CostumError",
        message: "Invalide Token",
        statusCode: 400,
      });
    }

    res.status(200).json({
      success: true,
    });
  } catch (error) {
    next(error);
  }
};
