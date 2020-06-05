const cheerio = require("cheerio");
const axios = require("axios");

// @desc       Search Courses
// @route      GET /courses/:course
// @access     Public
exports.getCourse = async (req, res, next) => {
  try {
    let data;
    let error = false;

    await axios
      .get(`https://www.learningcrux.com/course/${req.params.course}`)
      .then((response) => {
        const $ = cheerio.load(response.data);
        const title = $(`article#content h1.content-h1`).text().trim();
        const cover = $(`article#content div.single_poster img`).attr("src");

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
              length: lectureInfo[2],
            },
          };

          curriculum.push(lecture);
        });

        // Detail
        const detail = {};
        $(`section.widget_course_select ul li`).each((index, element) => {
          const detailSelect = $(element).text().trim().split(": ")[1];
          switch (index) {
            case 0:
              detail.students = detailSelect;
              break;
            case 1:
              detail.sections = detailSelect;
              break;
            case 2:
              detail.videos = detailSelect;
              break;
            case 3:
              detail.length = detailSelect;
              break;
            case 4:
              detail.addedDate = detailSelect;
              break;
          }
        });

        // What You will learn
        let learn = [];
        $("p.description_box + ul li").each((index, element) => {
          learn.push($(element).text().trim());
        });

        // Course Description
        let desc = response.data.split("<p>Description</p>")[1];

        // Course Headline
        let headline;

        if (desc) {
          desc = desc.split("</article>")[0].trim();
          headline = $(`#description_detail + p`).text().trim();
        } else {
          desc = $(`#description_detail + p`).text().trim();
        }

        if ($("#description_detail").text() !== "\n") {
          desc = $("#description_detail").text().trim();
        }

        // Requirements
        const requirements = [];
        $("#description_detail + p + p + ul li").each((index, element) => {
          requirements.push($(element).text().trim());
        });

        const newCurriculum = [];

        const course = {
          title,
          headline,
          cover,
          detail,
          learn,
          requirements,
          desc,
          curriculum,
        };

        // List in Section the Leactures
        if (req.query.sort != "false") {
          let count = 0;
          $(`.sectionRow`).each((index, element) => {
            const info = $(element).find("h2.h6").text().trim().split("\n");

            const lectureCount = $(element)
              .find(`#accordion div.panel`)
              .children().length;

            const lections = curriculum.slice(count, lectureCount + count);

            count += lectureCount;

            const section = {
              sectionCount: info[0].replace(":", ""),
              sectionTitle: info[1],
              lections,
            };

            newCurriculum.push(section);
          });

          course.curriculum = newCurriculum;
        }

        data = course;
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
      success: true,
      data,
    });
  } catch (error) {
    next(error);
  }
};
