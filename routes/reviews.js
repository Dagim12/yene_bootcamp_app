const express = require("express");

const {
  getReviews,
  getReview,
  createReview,
} = require("../controllers/reviews");

const Review = require("../models/review");

const router = express.Router({ mergeParams: true });

const advancedResults = require("../middleware/advancedResults");

const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(
    advancedResults(Review, {
      path: "bootcamp",
      select: "name description",
    }),
    getReviews
  )
  .post(protect, authorize("user", "admin"), createReview);

router.route("/:id").get(getReview);
router.route("/:bootcampId");

module.exports = router;
