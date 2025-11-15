const { connectDB, getDB } = require('./config/db');

async function testConnection() {
  try {
    await connectDB();
    const db = getDB();
    const count = await db.collection('properties').countDocuments();
    console.log('✅ Connection Successful! Properties count:', count);
    process.exit(0);
  } catch (error) {
    console.error('❌ Connection Failed:', error.message);
    process.exit(1);
  }
}

testConnection();