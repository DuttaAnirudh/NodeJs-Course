const express = require('express');

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// By default, each router has access only to their specific params
// to gain access params of other routes like tour routes param i.e :tourId
// we need to set mergeParams to "true"
// Now /reviews will have access to all the params in its previous routes like
// /tours/:tourId/reviews
const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview,
  );

module.exports = router;