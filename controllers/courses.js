const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Course = require("../models/course");
const Bootcamp = require("../models/Bootcamp");

// @desc Get All courses
// @route GET /api/v1/courses
// @route GET /api/v1/bootcamps/:bootcampId/courses
// @access Public

exports.getCourses = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const courses = await Course.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: course.length,
      data: courses,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

//@desc Get get a course
//@route GET /api/v1/courses/:id
//access Public
exports.getCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id).populate({
    path: "bootcamp",
    select: "name description",
  });

  if (!course) {
    return next(
      new ErrorResponse(`Course with id ${req.params.id} not found`, 404)
    );
  }

  res.status(200).json({ success: true, data: course });
});

// @desc Create a course
// @route POST /api/v1/bootcamps/:bootcampId/courses
// @access Private

exports.addCourse = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;

  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp with id ${req.params.id} not found`, 404)
    );
  }

  //make sure the current user is the owner of the bootcamp
  if (bootcamp.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(
        `This user is not authorized to add a course to the bootcamp`,
        401
      )
    );
  }
  const courses = await Course.create(req.body);

  res.status(200).json({
    success: true,
    data: courses,
  });
});

// @desc Update a course
// @route PUT /api/v1/courses/:id
// @access Private

exports.updateCourse = asyncHandler(async (req, res, next) => {
  let course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course found with id ${req.params.id}`, 404)
    );
  }
  //make sure the current user is the owner of the course
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`This user is not authorized to update the course`, 401)
    );
  }
  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

// @desc Delete a course
// @route DELETE /api/v1/courses/:id
// @access Private

exports.deleteCourse = asyncHandler(async (req, res, next) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return next(
      new ErrorResponse(`No course found with id ${req.params.id}`, 404)
    );
  }
  //make sure the current user is the owner of the course
  if (course.user.toString() !== req.user.id && req.user.role !== "admin") {
    return next(
      new ErrorResponse(`This user is not authorized to delete the course`, 401)
    );
  }
  await Course.deleteOne({ _id: req.params.id });

  res.status(200).json({
    success: true,
    data: {},
  });
});
