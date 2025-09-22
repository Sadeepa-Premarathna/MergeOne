const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from specific path
dotenv.config({ path: path.join(__dirname, '.env') });

const testConnection = async () => {
  try {
    console.log('🔍 Testing MongoDB connection...');
    console.log('📍 MongoDB URI from env:', process.env.MONGODB_URI ? 'Set in environment' : 'Not found');
    console.log('📍 Full URI (first 50 chars):', process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 50) + '...' : 'Not set');
    
    if (!process.env.MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      return;
    }
    
    // Try to connect
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    
    console.log('✅ Connected to MongoDB Atlas successfully!');
    console.log('🔗 Database:', mongoose.connection.db.databaseName);
    console.log('🌐 Host:', mongoose.connection.host);
    
    // Test basic operation
    const testCollection = mongoose.connection.db.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    console.log('✅ Test write operation successful');
    
    await testCollection.deleteOne({ test: 'connection' });
    console.log('✅ Test delete operation successful');
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    if (error.reason) {
      console.error('📋 Reason:', error.reason);
    }
    
    // Try fallback
    console.log('🔄 Trying connection without options...');
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      console.log('✅ Connected with basic options!');
    } catch (fallbackError) {
      console.error('❌ Fallback connection also failed:', fallbackError.message);
    }
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
};

testConnection();