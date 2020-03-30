const cheerio = require("cheerio");
const request = require("request");

// @desc       Search Courses
// @route      GET /search/:query
// @access     Public
exports.searchCourses = async (req, res, next) => {
  try {
    const data = [];

    const search = () => {
      return new Promise(resolve => {
        request.get(
          `https://www.learningcrux.com/search?query=${req.params.query}`,
          (err, response, html) => {
            if (!err && response.statusCode == 200) {
              const $ = cheerio.load(html);

              $(`article#content div.row div.col-xs-12`).each(
                (index, element) => {
                  const cover = $(element)
                    .find("img")
                    .attr("data-src");
                  const title = $(element)
                    .find(`.post-heading`)
                    .text()
                    .trim();
                  const source = $(element)
                    .find(`strong.text`)
                    .text()
                    .trim();
                  const link = $(element)
                    .find(`article a`)
                    .attr("href");

                  const course = {
                    cover,
                    title,
                    source,
                    link
                  };

                  if (link.startsWith("/course/")) {
                    data.push(course);
                  }
                }
              );
            }
            resolve();
          }
        );
      });
    };

    await search();

    res.status(200).json({
      success: true,
      count: data.length,
      data
    });
  } catch (error) {
    next(error);
  }
};
