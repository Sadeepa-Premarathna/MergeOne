import mongoose from 'mongoose';
import dns from 'dns';

export async function connectDB(): Promise<mongoose.Connection> {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) throw new Error('MONGODB_URI is required in environment variables');
  
  // Optional: override DNS servers to help resolve Atlas SRV in restricted networks
  const dnsServers = process.env.MONGODB_DNS_SERVERS;
  if (dnsServers) {
    const servers = dnsServers.split(',').map(s => s.trim()).filter(Boolean);
    if (servers.length) {
      dns.setServers(servers);
      console.log('🧭 Using custom DNS servers for MongoDB SRV:', servers.join(', '));
    }
  }
  
  mongoose.set('strictQuery', true);
  
  const options: mongoose.ConnectOptions = {
    serverSelectionTimeoutMS: 15000,
    socketTimeoutMS: 45000,
    bufferCommands: false,
    maxPoolSize: 10,
    minPoolSize: 1,
    family: 4, // Force IPv4
    connectTimeoutMS: 15000
  };

  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    console.log('📡 Connection type:', mongoUri.includes('localhost') ? 'Local' : 'Atlas');
    console.log('🔗 Mongo URI (masked):', mongoUri.replace(/\/\/.*@/, '//***:***@'));
    
    await mongoose.connect(mongoUri, options);
    console.log('✅ Connected to MongoDB successfully');
    console.log('📊 Database:', mongoose.connection.db?.databaseName);
    return mongoose.connection;
  } catch (error: any) {
    console.error('❌ Failed to connect to MongoDB:', error.message);
    // Optional fallback: try MONGODB_URI_ALT (standard mongodb://) when SRV fails
    const alt = process.env.MONGODB_URI_ALT;
    if (alt) {
      try {
        console.log('🛣️ Trying alternate MongoDB URI (non-SRV)...');
        console.log('🔗 Alt Mongo URI (masked):', alt.replace(/\/\/.*@/, '//***:***@'));
        await mongoose.connect(alt, options);
        console.log('✅ Connected to MongoDB via alternate URI');
        return mongoose.connection;
      } catch (errAlt: any) {
        console.error('❌ Alternate MongoDB connection also failed:', errAlt.message);
      }
    }
    console.log('⚠️ MongoDB connection failed, continuing in mock data mode');
    throw error;
  }
}
