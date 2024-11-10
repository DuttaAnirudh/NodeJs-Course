const express = require('express');

const tourController = require('../controllers/tourController');

const router = express.Router();

const authController = require('../controllers/authController');
// const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

// PARAM MIDDLEWARE
// router.param(request, response, next, valueOfParam)
// router.param('id', tourController.checkID);

// If the route is similar to "/:tourId/reviews", then use the Review Router rather than the tour router
router.use('/:tourId/reviews', reviewRouter); // re-routing to review router

router
  .route('/top-5-cheap')
  .get(tourController.aliasTopTours, tourController.getAllTours);

router.route('/tour-stats').get(tourController.getTourStats);
router
  .route('/monthly-plan/:year')
  .get(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide', 'guide'),
    tourController.getMonthlyPlan,
  );

router
  .route('/tours-within/:distance/center/:latlng/:unit')
  .get(tourController.getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

router
  .route('/')
  .get(tourController.getAllTours)
  // .post(tourController.checkBody, tourController.createNewTour);
  .post(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.createTour,
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.updateTour,
  )
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourController.deleteTour,
  );

// Nested Routes
// router.route('/:tourId/reviews').post(
//   authController.protect,
//   authController.restrictTo('users'),
//   reviewController.createReview, // creating reviews from tour route for a particular tour
// );

module.exports = router;
