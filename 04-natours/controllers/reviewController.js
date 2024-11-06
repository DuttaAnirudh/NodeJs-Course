const Review = require('../models/reviewModel');
const catchAsync = require('../utils/catchAsync');

// Fetching all reviews
exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};

  if (req.params.tourId) {
    filter = { tour: req.params.tourId };
  }

  // If the filter object is empty, we'll get all the reviews
  // But if the filter object has tour property with id, then we'll only get a particular review which matches that id
  const reviews = await Review.find(filter);

  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

// Creating New Reviews
exports.createReview = catchAsync(async (req, res, next) => {
  // Allow Nested Routes
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }
  if (!req.body.user) {
    req.body.user = req.user.id;
  }

  const newReview = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});
