const { MongoClient } = require('mongodb');

let db;
let client;

const connectDB = async () => {
  try {
    console.log('🔌 Connecting to MongoDB...');
    console.log('📍 URI:', process.env.MONGODB_URI ? 'Found ✅' : '❌ MISSING!');

    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    client = new MongoClient(process.env.MONGODB_URI);
    await client.connect();
    
    db = client.db('homenest'); // Your database name
    
    console.log(`✅ MongoDB Connected Successfully`);
    console.log(`📊 Database: ${db.databaseName}`);
    
    return db;
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    throw error;
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

const closeDB = async () => {
  if (client) {
    await client.close();
    console.log('🔌 MongoDB connection closed');
  }
};

// Handle process termination
process.on('SIGINT', async () => {
  await closeDB();
  process.exit(0);
});

module.exports = { connectDB, getDB, closeDB };