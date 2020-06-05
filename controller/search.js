const cheerio = require("cheerio");
const axios = require("axios");
const fs = require("fs");

// @desc       Search Courses
// @route      GET /search/:query
// @access     Public
exports.searchCourses = async (req, res, next) => {
  let data = [];
  let count = 0;
  let error = false;
  try {
    await axios
      .get(`https://www.learningcrux.com/search?query=${req.params.query}`)
      .then((response) => {
        const $ = cheerio.load(response.data);
        // Check if any Course Exist with query
        const notFound = $(`article#content div.row `).children().length;
        if (notFound === 0) {
          error = true;
        }
        $(`article#content div.row div.col-xs-12`).each((index, element) => {
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
            data.push(course);
            count++;
          }
        });
      })
      .catch(() => {
        error = true;
      });

    

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
      paggiantion = { limit, currentPage: page,count };

      if (startIndex > 0) {
        paggiantion.prevPage = page - 1;
      }

      if (total > endIndex) {
        paggiantion.nextPage = page + 1;
      }
      data = data.slice(startIndex, startIndex + limit);
	
	if(data.length === 0){
	error = true}

    } else {
      // If not show all search results
      paggiantion = "Paggination is Disabled";
    }

	if (error) {
	      return next({
		name: "CostumError",
		message: "Nothing was found",
		statusCode: 404,
	      });
	    }

    res.status(200).json({
      success: true,
      paggiantion,
      data,
    });
  } catch (error) {
    next(error);
  }
};
