const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const propertyRoutes = require('./routes/properties');
const ratingRoutes = require('./routes/ratings');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Health check (no DB needed)
app.get('/', (req, res) => {
  res.json({ message: 'HomeNest server is running ✅' });
});

// Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/ratings', ratingRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Async start: Wait for DB connection
const startServer = async () => {
  try {
    await connectDB();  // Await connection
    app.listen(port, () => {
      console.log(`🚀 Server is running on port ${port}`);  // Fixed: Added opening backtick and parenthesis
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();