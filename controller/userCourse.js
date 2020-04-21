const UserCourse = require("../models/userCourse");

// @desc       Get User Courses
// @route      GET /user/courses
// @access     Private
exports.getCourses = async (req, res, next) => {
  try {
    let query;

    // Paggiantion
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await UserCourse.countDocuments({ user: req.user.id });
    const paggination = { limit, count: total };

    if (startIndex > 0) {
      paggination.prevPage = page - 1;
    }

    if (total > endIndex) {
      paggination.nextPage = page + 1;
    }

    if (req.query.status === "watching" || req.query.status === "bookmark") {
      query = UserCourse.find({ user: req.user.id, status: req.query.status });
    } else {
      query = UserCourse.find({ user: req.user.id });
    }

    query = query.skip(startIndex).limit(limit);

    const data = await query;

    res.status(200).json({
      success: true,
      paggination,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc       Post Course
// @route      POST /user/courses
// @access     Private
exports.postCourse = async (req, res, next) => {
  try {
    const { cover, title, source, link } = req.body;
    const data = await UserCourse.create({
      cover,
      title,
      source,
      link,
      user: req.user.id,
    });

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};

// @desc       Remove Course
// @route      DELETE /user/courses/:id
// @access     Private
exports.deleteCourse = async (req, res, next) => {
  try {
    const data = await UserCourse.findById(req.params.id);

    if (!data) {
      return next({
        name: "CastError",
        statusCode: 404,
      });
    }

    data.remove();

    res.status(200).json({
      success: true,
      data: "Resourse was deleted succefully",
    });
  } catch (error) {
    next(error);
  }
};
