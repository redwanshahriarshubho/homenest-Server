const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    await client.connect();
    console.log("Connected to MongoDB!");

    const database = client.db("homeNestDB");
    const propertiesCollection = database.collection("properties");
    const ratingsCollection = database.collection("ratings");

    // ========== PROPERTY ROUTES ==========

    // Get all properties (with optional search and sort)
    app.get('/api/properties', async (req, res) => {
      try {
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
        res.status(500).json({ message: error.message });
      }
    });

    // Get featured properties (6 newest)
    app.get('/api/properties/featured', async (req, res) => {
      try {
        const properties = await propertiesCollection
          .find()
          .sort({ postedDate: -1 })
          .limit(6)
          .toArray();
        
        res.json(properties);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // Get single property by ID
    app.get('/api/properties/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const property = await propertiesCollection.findOne(query);
        
        if (!property) {
          return res.status(404).json({ message: 'Property not found' });
        }
        
        res.json(property);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // Get properties by user email
    app.get('/api/properties/user/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const properties = await propertiesCollection
          .find({ userEmail: email })
          .sort({ postedDate: -1 })
          .toArray();
        
        res.json(properties);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // Add new property
    app.post('/api/properties', async (req, res) => {
      try {
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
        res.status(500).json({ message: error.message });
      }
    });

    // Update property
    app.put('/api/properties/:id', async (req, res) => {
      try {
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
        res.status(500).json({ message: error.message });
      }
    });

    // Delete property
    app.delete('/api/properties/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await propertiesCollection.deleteOne(query);
        
        if (result.deletedCount === 0) {
          return res.status(404).json({ message: 'Property not found' });
        }
        
        res.json({ message: 'Property deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // ========== RATINGS ROUTES ==========

    // Get ratings for a property
    app.get('/api/ratings/property/:propertyId', async (req, res) => {
      try {
        const propertyId = req.params.propertyId;
        const ratings = await ratingsCollection
          .find({ propertyId })
          .sort({ reviewDate: -1 })
          .toArray();
        
        res.json(ratings);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // Get ratings by user email
    app.get('/api/ratings/user/:email', async (req, res) => {
      try {
        const email = req.params.email;
        const ratings = await ratingsCollection
          .find({ reviewerEmail: email })
          .sort({ reviewDate: -1 })
          .toArray();
        
        res.json(ratings);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });

    // Add new rating
    app.post('/api/ratings', async (req, res) => {
      try {
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
        res.status(500).json({ message: error.message });
      }
    });

    // Health check
    app.get('/', (req, res) => {
      res.json({ message: 'HomeNest server is running' });
    });

  } catch (error) {
    console.error("MongoDB connection error:", error);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});