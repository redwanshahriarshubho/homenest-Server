require('dotenv').config();
const { MongoClient } = require('mongodb');

async function testConnection() {
  const uri = process.env.MONGODB_URI;
  
  console.log('🔍 Testing MongoDB Atlas Connection...');
  console.log('📍 Cluster:', uri.includes('cluster0.ycs1c67') ? 'cluster0.ycs1c67 ✅' : '❌');
  console.log('📍 Database name:', uri.split('/')[3]?.split('?')[0] || '❌ NOT SPECIFIED');
  console.log('');
  console.log('⏳ Attempting connection (timeout: 10 seconds)...');
  
  try {
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 10000, // 10 second timeout
      connectTimeoutMS: 10000
    });
    
    console.log('🔄 Connecting...');
    await client.connect();
    
    console.log('✅ CONNECTION SUCCESSFUL!');
    console.log('📊 Database:', client.db().databaseName);
    
    // Test a simple operation
    const adminDb = client.db().admin();
    const serverInfo = await adminDb.serverInfo();
    console.log('🎉 MongoDB version:', serverInfo.version);
    
    await client.close();
    console.log('✅ Test completed successfully!');
    process.exit(0);
    
  } catch (error) {
    console.error('❌ CONNECTION FAILED!');
    console.error('');
    
    if (error.message.includes('ETIMEOUT') || error.message.includes('querySrv')) {
      console.error('🚫 ERROR TYPE: Network Timeout');
      console.error('');
      console.error('🔧 SOLUTIONS:');
      console.error('1. Add your IP to MongoDB Atlas Network Access');
      console.error('   → Go to: https://cloud.mongodb.com');
      console.error('   → Network Access → Add IP Address → Allow Access from Anywhere');
      console.error('');
      console.error('2. Check your firewall/antivirus');
      console.error('3. Try a different network (mobile hotspot)');
      console.error('4. Wait 2-3 minutes after adding IP to Atlas');
      
    } else if (error.message.includes('authentication') || error.message.includes('auth')) {
      console.error('🚫 ERROR TYPE: Authentication Failed');
      console.error('');
      console.error('🔧 SOLUTIONS:');
      console.error('1. Check username/password in .env');
      console.error('2. Verify user exists in Database Access');
      console.error('3. User must have "Read and write" permissions');
      
    } else {
      console.error('🚫 ERROR TYPE:', error.name);
      console.error('📝 ERROR MESSAGE:', error.message);
    }
    
    console.error('');
    console.error('Full error:', error);
    process.exit(1);
  }
}

testConnection();