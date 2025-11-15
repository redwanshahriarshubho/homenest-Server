const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const propertyRoutes = require('./routes/properties');
const ratingRoutes = require('./routes/ratings');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
connectDB();

// Health check
app.get('/', (req, res) => {
  res.json({ 
    message: 'HomeNest server is running ✅',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/properties', propertyRoutes);
app.use('/api/ratings', ratingRoutes);

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server (for local development only)
if (require.main === module) {
  app.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
  });
}

// Export for Vercel
module.exports = app;