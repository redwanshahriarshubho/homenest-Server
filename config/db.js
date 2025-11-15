const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

const connectDB = async () => {
  try {
    await client.connect();
    db = client.db("homeNestDB");
    console.log("✅ Connected to MongoDB!");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    // Don't exit in serverless environment
    if (process.env.NODE_ENV !== 'production') {
      process.exit(1);
    }
  }
};

const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

module.exports = connectDB;
module.exports.getDB = getDB;
module.exports.client = client;