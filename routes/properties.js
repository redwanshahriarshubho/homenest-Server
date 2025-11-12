const express = require('express');
const router = express.Router();
const {
  getAllProperties,
  getFeaturedProperties,
  getPropertyById,
  getUserProperties,
  addProperty,
  updateProperty,
  deleteProperty
} = require('../controllers/propertyController');

// GET routes
router.get('/', getAllProperties);
router.get('/featured', getFeaturedProperties);
router.get('/user/:email', getUserProperties);
router.get('/:id', getPropertyById);

// POST route
router.post('/', addProperty);

// PUT route
router.put('/:id', updateProperty);

// DELETE route
router.delete('/:id', deleteProperty);

module.exports = router;