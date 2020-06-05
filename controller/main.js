const cheerio = require("cheerio");
const axios = require("axios");

// @desc       Get Popluar Courses
// @route      GET /courses/:course
// @access     Public
exports.main = async (req, res, next) => {
  try {
    let data = {
      recent: [],
      popular: [],
    };
    let error = false;

    const getCardInfo = (tag, response, location) => {
      const $ = cheerio.load(response.data);

      $(tag).each((index, element) => {
        const cover = $(element).find("img").attr("data-src").split("?")[0];
        const title = $(element).find(`.post-heading`).text().trim();
        const source = $(element).find(`strong.text`).text().trim();
        const link = $(element).find(`article a`).attr("href");
        const course = {
          cover,
          title,
          source,
          link,
        };
        if (link.startsWith("/course/")) {
          if (location) {
            data.popular.push(course);
            return;
          }
          data.recent.push(course);
        }
      });
    };

    // Get Popluar Courses
    await axios
      .get("https://www.learningcrux.com/")
      .then((response) => {
        getCardInfo(
          "#main .container .row section:nth-child(3) .row article",
          response,
          false
        );
        getCardInfo(
          "#main .container .row section:first-child .row article",
          response,
          true
        );
      })
      .catch(() => {
        error = true;
      });

    if (error) {
      return next({
        name: "CostumError",
        message: "Nothing was found",
        statusCode: 404,
      });
    }

    res.status(200).json({
      suceess: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
