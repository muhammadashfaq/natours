const express = require('express');
const fs = require('fs');
const tourController = require('../controllers/tourController');

const router = express.Router();

router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.createTour);
router
  .route('/:id')
  .get(tourController.getTourDetail)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

module.exports = router;
