const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router();

router.route('/').get(authController.protect, reviewController.getAllReviews).post(reviewController.createTour)

module.exports = router;
