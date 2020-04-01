const cheerio = require("cheerio");
const request = require("request");

// @desc       Search Courses
// @route      GET /search/:query
// @access     Public
exports.searchCourses = async (req, res, next) => {
  try {
    let data = [];

    const search = () => {
      return new Promise(resolve => {
        request.get(
          `https://www.learningcrux.com/search?query=${req.params.query}`,
          (err, response, html) => {
            if (!err && response.statusCode == 200) {
              const $ = cheerio.load(html);

              // Check if any Course Exist with query
              const notFound = $(`article#content div.row `).children().length;

              if (notFound === 0) {
                return next({
                  message: "No Course was found",
                  statusCode: 404
                });
              }

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

    // Paggination
    let paggiantion;
    const allowPaggination = req.query.paggination || true;
    // Check if paggiantion is disabled
    if (allowPaggination !== "false") {
      const page = parseInt(req.query.page, 10) || 1;
      const limit = parseInt(req.query.limit, 10) || 10;
      const startIndex = (page - 1) * limit;
      const endIndex = page * limit;
      const total = data.length;
      paggiantion = { limit };

      if (startIndex > 0) {
        paggiantion.prevPage = page - 1;
      }

      if (total > endIndex) {
        paggiantion.nextPage = page + 1;
      }
      data = data.slice(startIndex, startIndex + limit);
    } else {
      // If not show all search results
      paggiantion = "Paggination is Disabled";
    }

    res.status(200).json({
      success: true,
      count: data.length,
      paggiantion,
      data
    });
  } catch (error) {
    next(error);
  }
};
