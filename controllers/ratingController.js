const { getDB } = require('../config/db');

// Get ratings for a property
const getPropertyRatings = async (req, res, next) => {
  try {
    const db = getDB();
    const ratingsCollection = db.collection('ratings');
    const propertyId = req.params.propertyId;
    
    const ratings = await ratingsCollection
      .find({ propertyId })
      .sort({ reviewDate: -1 })
      .toArray();
    
    res.json(ratings);
  } catch (error) {
    next(error);
  }
};

// Get ratings by user email
const getUserRatings = async (req, res, next) => {
  try {
    const db = getDB();
    const ratingsCollection = db.collection('ratings');
    const email = req.params.email;
    
    const ratings = await ratingsCollection
      .find({ reviewerEmail: email })
      .sort({ reviewDate: -1 })
      .toArray();
    
    res.json(ratings);
  } catch (error) {
    next(error);
  }
};

// Add new rating
const addRating = async (req, res, next) => {
  try {
    const db = getDB();
    const ratingsCollection = db.collection('ratings');
    
    const rating = {
      ...req.body,
      reviewDate: new Date().toISOString()
    };
    
    const result = await ratingsCollection.insertOne(rating);
    res.status(201).json({ 
      message: 'Rating added successfully',
      insertedId: result.insertedId 
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPropertyRatings,
  getUserRatings,
  addRating
};