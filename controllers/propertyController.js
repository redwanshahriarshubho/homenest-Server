const { ObjectId } = require('mongodb');
const { getDB } = require('../config/db');

// Get all properties (with search and sort)
const getAllProperties = async (req, res, next) => {
  try {
    const db = getDB();
    const propertiesCollection = db.collection('properties');
    const { search, sort } = req.query;
    
    let query = {};
    
    // Search by property name
    if (search) {
      query.propertyName = { $regex: search, $options: 'i' };
    }

    let sortOptions = {};
    if (sort === 'price_asc') {
      sortOptions.price = 1;
    } else if (sort === 'price_desc') {
      sortOptions.price = -1;
    } else if (sort === 'date_desc') {
      sortOptions.postedDate = -1;
    } else if (sort === 'date_asc') {
      sortOptions.postedDate = 1;
    }

    const properties = await propertiesCollection
      .find(query)
      .sort(sortOptions)
      .toArray();
    
    res.json(properties);
  } catch (error) {
    next(error);
  }
};

// Get featured properties (6 newest)
const getFeaturedProperties = async (req, res, next) => {
  try {
    const db = getDB();
    const propertiesCollection = db.collection('properties');
    
    const properties = await propertiesCollection
      .find()
      .sort({ postedDate: -1 })
      .limit(6)
      .toArray();
    
    res.json(properties);
  } catch (error) {
    next(error);
  }
};

// Get single property by ID
const getPropertyById = async (req, res, next) => {
  try {
    const db = getDB();
    const propertiesCollection = db.collection('properties');
    const id = req.params.id;
    
    const query = { _id: new ObjectId(id) };
    const property = await propertiesCollection.findOne(query);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json(property);
  } catch (error) {
    next(error);
  }
};

// Get properties by user email
const getUserProperties = async (req, res, next) => {
  try {
    const db = getDB();
    const propertiesCollection = db.collection('properties');
    const email = req.params.email;
    
    const properties = await propertiesCollection
      .find({ userEmail: email })
      .sort({ postedDate: -1 })
      .toArray();
    
    res.json(properties);
  } catch (error) {
    next(error);
  }
};

// Add new property
const addProperty = async (req, res, next) => {
  try {
    const db = getDB();
    const propertiesCollection = db.collection('properties');
    
    const property = {
      ...req.body,
      postedDate: new Date().toISOString()
    };
    
    const result = await propertiesCollection.insertOne(property);
    res.status(201).json({ 
      message: 'Property added successfully',
      insertedId: result.insertedId 
    });
  } catch (error) {
    next(error);
  }
};

// Update property
const updateProperty = async (req, res, next) => {
  try {
    const db = getDB();
    const propertiesCollection = db.collection('properties');
    const id = req.params.id;
    
    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
      $set: {
        propertyName: req.body.propertyName,
        description: req.body.description,
        category: req.body.category,
        price: req.body.price,
        location: req.body.location,
        imageLink: req.body.imageLink
      }
    };
    
    const result = await propertiesCollection.updateOne(filter, updateDoc);
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json({ message: 'Property updated successfully' });
  } catch (error) {
    next(error);
  }
};

// Delete property
const deleteProperty = async (req, res, next) => {
  try {
    const db = getDB();
    const propertiesCollection = db.collection('properties');
    const id = req.params.id;
    
    const query = { _id: new ObjectId(id) };
    const result = await propertiesCollection.deleteOne(query);
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.json({ message: 'Property deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllProperties,
  getFeaturedProperties,
  getPropertyById,
  getUserProperties,
  addProperty,
  updateProperty,
  deleteProperty
};