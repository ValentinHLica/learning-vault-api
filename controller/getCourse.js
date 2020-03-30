const cheerio = require("cheerio");
const request = require("request");

const fs = require("fs");

// @desc       Search Courses
// @route      GET /search/:query
// @access     Public
exports.getCourse = async (req, res, next) => {
  try {
    let data;

    const Course = () => {
      return new Promise(resolve => {
        request.get(
          `https://www.learningcrux.com/course/${req.params.course}`,
          (err, response, html) => {
            if (!err && response.statusCode == 200) {
              const $ = cheerio.load(html);
              const title = $(`article#content h1.content-h1`)
                .text()
                .trim();
              const cover = $(`article#content div.single_poster img`).attr(
                "data-src"
              );

              const curriculum = [];

              // Get all Lectures
              $(`.panel`).each((index, element) => {
                const lectureVideo = $(element)
                  .find(`a.accOpener`)
                  .attr("href")
                  .replace("/video/", "/play/");

                const lectureInfo = $(element)
                  .find(`a.accOpener :first-child`)
                  .text()
                  .trim()
                  .split("\n");

                const lecture = {
                  lectureVideo,
                  info: {
                    title: lectureInfo[0],
                    type: lectureInfo[1],
                    length: lectureInfo[2]
                  }
                };

                curriculum.push(lecture);
              });

              const newCurriculum = [];

              // List in Section the Leactures
              let count = 0;
              $(`.sectionRow`).each((index, element) => {
                const info = $(element)
                  .find("h2.h6")
                  .text()
                  .trim()
                  .split("\n");

                const lectureCount = $(element)
                  .find(`#accordion div.panel`)
                  .children().length;

                const lections = curriculum.slice(count, lectureCount + count);

                count += lectureCount - 1;

                const section = {
                  sectionCount: info[0].replace(":", ""),
                  sectionTitle: info[1],
                  lections
                };

                newCurriculum.push(section);
              });

              const course = {
                title,
                cover,
                curriculum: newCurriculum
              };

              data = course;
            } else {
              return next({
                message: "Course does not exist",
                statusCode: 404
              });
            }
            resolve();
          }
        );
      });
    };

    await Course();

    res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    next(error);
  }
};
