const express = require('express');
const router = express.Router();
const {
  getPropertyRatings,
  getUserRatings,
  addRating
} = require('../controllers/ratingController');

// GET routes
router.get('/property/:propertyId', getPropertyRatings);
router.get('/user/:email', getUserRatings);

// POST route
router.post('/', addRating);

module.exports = router;