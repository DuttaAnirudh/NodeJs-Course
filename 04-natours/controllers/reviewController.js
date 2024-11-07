const Review = require('../models/reviewModel');
// const catchAsync = require('../utils/catchAsync');
const factory = require('./handleFactory');

// Fetching all reviews
exports.getAllReviews = factory.getAll(Review);
// exports.getAllReviews = catchAsync(async (req, res, next) => {
//   let filter = {};

//   if (req.params.tourId) {
//     filter = { tour: req.params.tourId };
//   }

//   // If the filter object is empty, we'll get all the reviews
//   // But if the filter object has tour property with id, then we'll only get a particular review which matches that id
//   const reviews = await Review.find(filter);

//   res.status(200).json({
//     status: 'success',
//     results: reviews.length,
//     data: {
//       reviews,
//     },
//   });
// });

exports.getReview = factory.getOne(Review);

// Middleware: If the review does'nt have UserId and TourId
// Add them to the request
exports.setTourAndUserIds = (req, res, next) => {
  // Allow Nested Routes
  if (!req.body.tour) {
    req.body.tour = req.params.tourId;
  }
  if (!req.body.user) {
    req.body.user = req.user.id;
  }

  next();
};

// Creating New Reviews
exports.createReview = factory.createOne(Review);
// exports.createReview = catchAsync(async (req, res, next) => {
//   const newReview = await Review.create(req.body);

//   res.status(201).json({
//     status: 'success',
//     data: {
//       review: newReview,
//     },
//   });
// });

exports.updateReview = factory.updateOne(Review);

exports.deleteReview = factory.deleteOne(Review);
