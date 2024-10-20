const express = require('express');

const tourController = require('../controllers/tourController');

const router = express.Router();

// PARAM MIDDLEWARE
// router.param(request, response, next, valueOfParam)
// router.param('id', tourController.checkID);

router
  .route('/')
  .get(tourController.getAllTours)
  // .post(tourController.checkBody, tourController.createNewTour);
  .post(tourController.createTour);

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
