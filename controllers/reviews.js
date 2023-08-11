const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Review = require("../models/review");
const Bootcamp = require("../models/Bootcamp");

// @desc Get All Reviews
// @route GET /api/v1/reviews
// @route GET /api/v1/bootcamps/:bootcampId/reviews
// @access Public

exports.getReviews = asyncHandler(async (req, res, next) => {
  if (req.params.bootcampId) {
    const reviews = await Review.find({ bootcamp: req.params.bootcampId });

    return res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc Get a Review
// @route GET /api/v1/reviews/:id
// @access Public

exports.getReview = asyncHandler(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new ErrorResponse("No review found with that ID"), 404);
  }

  res.status(200).json({
    success: true,
    data: review,
  });
});

// @desc add a Review
// @route POST /api/v1/bootcamps/:bootcampId/reviews
// @access Private

exports.createReview = asyncHandler(async (req, res, next) => {
  req.body.bootcamp = req.params.bootcampId;
  req.body.user = req.user.id;
  const bootcamp = await Bootcamp.findById(req.params.bootcampId);

  if (!bootcamp) {
    return next(new ErrorResponse("Bootcamp not found", 404));
  }
  const review = await Review.create(req.body);

  res.status(200).json({
    success: true,
    data: review,
  });
});
