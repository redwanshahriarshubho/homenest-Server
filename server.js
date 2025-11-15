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

// Connect to DB (sync for Vercel, but we await in local startup)
connectDB()
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// For local development ONLY: Async start with listen
if (require.main === module && process.env.NODE_ENV !== 'production') {
  const startServer = async () => {
    try {
      await connectDB();  // Await connection (ensures DB ready)
      app.listen(port, () => {
        console.log(`🚀 Server is running on port ${port}`);
      });
    } catch (error) {
      console.error('❌ Failed to start server:', error);
      process.exit(1);
    }
  };
  startServer();
}

// Export for Vercel/serverless (ignored locally, but required for deployment)
module.exports = app;