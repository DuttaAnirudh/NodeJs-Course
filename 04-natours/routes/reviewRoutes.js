const express = require('express');

const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

// By default, each router has access only to their specific params
// to gain access params of other routes like tour routes param i.e :tourId
// we need to set mergeParams to "true"
// Now /reviews will have access to all the params in its previous routes like
// /tours/:tourId/reviews
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router.route('/').get(reviewController.getAllReviews).post(
  // authController.protect,
  // authController.restrictTo('user'),
  reviewController.createReview,
);

router
  .route('/:id')
  .get(reviewController.getReview)
  // .patch(reviewController.setTourAndUserIds, reviewController.updateReview)
  .patch(
    authController.restrictTo('user', 'admin'),
    reviewController.updateReview,
  )
  .delete(
    authController.restrictTo('user', 'admin'),
    reviewController.deleteReview,
  );

module.exports = router;
