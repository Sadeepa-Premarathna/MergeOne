import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import MilkCollection from '../models/MilkCollection.js';
import InventoryBatch from '../models/InventoryBatch.js';

dotenv.config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || '', {
      // Remove deprecated options that are now defaults
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const sampleProducts = [
  {
    name: 'Organic Whole Milk',
    description: 'Fresh organic whole milk from grass-fed cows. Rich in nutrients and perfect for daily consumption.',
    price: 4.99,
    category: 'milk',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    stock: 50,
    unit: 'liter',
    brand: 'FreshFarm',
    expiryDays: 7,
    isOrganic: true,
    fatContent: 3.5,
    volume: 1000,
    rating: 4.8,
    numReviews: 125,
    featured: true,
    reorderLevel: 10
  },
  {
    name: 'Aged Cheddar Cheese',
    description: 'Premium aged cheddar cheese with rich, sharp flavor. Perfect for sandwiches and cooking.',
    price: 8.50,
    category: 'cheese',
    image: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400',
    stock: 30,
    unit: 'kg',
    brand: 'ArtisanDairy',
    expiryDays: 60,
    isOrganic: false,
    fatContent: 32,
    volume: 500,
    rating: 4.6,
    numReviews: 89,
    featured: true,
    reorderLevel: 5
  },
  {
    name: 'Greek Yogurt',
    description: 'Creamy Greek yogurt packed with probiotics. Natural and healthy choice for breakfast.',
    price: 3.25,
    category: 'yogurt',
    image: 'https://images.unsplash.com/photo-1571212515416-0d4b22be5141?w=400',
    stock: 40,
    unit: 'pack',
    brand: 'HealthyChoice',
    expiryDays: 14,
    isOrganic: true,
    fatContent: 10,
    volume: 250,
    rating: 4.7,
    numReviews: 156,
    featured: true,
    reorderLevel: 8
  },
  {
    name: 'Fresh Butter',
    description: 'Creamy fresh butter made from premium cream. Perfect for cooking and baking.',
    price: 5.75,
    category: 'butter',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400',
    stock: 25,
    unit: 'pack',
    brand: 'CreamyDelight',
    expiryDays: 30,
    isOrganic: false,
    fatContent: 80,
    volume: 250,
    rating: 4.5,
    numReviews: 67,
    featured: false,
    reorderLevel: 6
  },
  {
    name: 'Heavy Cream',
    description: 'Rich heavy cream for cooking, baking, and coffee. High fat content for best results.',
    price: 4.25,
    category: 'cream',
    image: 'https://images.unsplash.com/photo-1563379091339-03246963d4d9?w=400',
    stock: 35,
    unit: 'liter',
    brand: 'PureCream',
    expiryDays: 10,
    isOrganic: false,
    fatContent: 35,
    volume: 500,
    rating: 4.4,
    numReviews: 43,
    featured: false,
    reorderLevel: 7
  },
  {
    name: 'Vanilla Ice Cream',
    description: 'Premium vanilla ice cream made with real vanilla beans. Creamy and delicious.',
    price: 6.99,
    category: 'ice-cream',
    image: 'https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=400',
    stock: 20,
    unit: 'pack',
    brand: 'SweetTreats',
    expiryDays: 90,
    isOrganic: false,
    fatContent: 16,
    volume: 1000,
    rating: 4.9,
    numReviews: 234,
    featured: true,
    reorderLevel: 4
  }
];

const sampleUsers = [
  {
    email: 'john.doe@example.com',
    name: 'John Doe',
    phone: '+1-555-0123',
    addresses: [{
      street: '123 Main Street',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      country: 'USA',
      isDefault: true
    }],
    preferences: {
      newsletter: true,
      smsNotifications: false
    },
    role: 'customer',
    isActive: true
  },
  {
    email: 'admin@dairylicious.com',
    name: 'Admin User',
    phone: '+1-555-0100',
    addresses: [{
      street: '456 Admin Avenue',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62702',
      country: 'USA',
      isDefault: true
    }],
    preferences: {
      newsletter: true,
      smsNotifications: true
    },
    role: 'admin',
    isActive: true
  }
];

const sampleMilkCollections = [
  {
    date: new Date('2024-01-15'),
    supplier: 'Green Valley Farm',
    quantity: 500,
    quality: 'A',
    fatContent: 3.8,
    proteinContent: 3.2,
    temperature: 4.2,
    pH: 6.7,
    pricePerLiter: 1.25,
    totalAmount: 625,
    batchNumber: 'GVF-2024-001',
    testResults: {
      bacteriaCount: 1200,
      somaticCellCount: 150000,
      antibiotics: false,
      adulterants: false
    },
    status: 'approved',
    notes: 'Excellent quality milk from grass-fed cows',
    createdBy: null, // Will be set after user creation
    approvedBy: null,
    approvedAt: new Date('2024-01-15T10:30:00Z')
  },
  {
    date: new Date('2024-01-16'),
    supplier: 'Sunshine Dairy',
    quantity: 300,
    quality: 'A',
    fatContent: 3.6,
    proteinContent: 3.1,
    temperature: 4.0,
    pH: 6.8,
    pricePerLiter: 1.20,
    totalAmount: 360,
    batchNumber: 'SD-2024-002',
    testResults: {
      bacteriaCount: 1000,
      somaticCellCount: 120000,
      antibiotics: false,
      adulterants: false
    },
    status: 'approved',
    notes: 'Good quality organic milk',
    createdBy: null,
    approvedBy: null,
    approvedAt: new Date('2024-01-16T09:45:00Z')
  }
];

const initializeDatabase = async () => {
  try {
    console.log('🚀 Starting database initialization...');
    
    // Connect to database
    await connectDB();
    
    // Clear existing data (optional - remove in production)
    console.log('🧹 Clearing existing data...');
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});
    await MilkCollection.deleteMany({});
    await InventoryBatch.deleteMany({});
    
    // Create sample users first
    console.log('👥 Creating sample users...');
    const createdUsers = await User.insertMany(sampleUsers);
    console.log(`✅ Created ${createdUsers.length} users`);
    
    // Create sample products
    console.log('🥛 Creating sample products...');
    const createdProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Created ${createdProducts.length} products`);
    
    // Update milk collections with user references
    const adminUser = createdUsers.find(user => user.role === 'admin');
    if (adminUser) {
      sampleMilkCollections.forEach(collection => {
        collection.createdBy = adminUser._id;
        collection.approvedBy = adminUser._id;
      });
    }
    
    // Create sample milk collections
    console.log('🥛 Creating sample milk collections...');
    const createdCollections = await MilkCollection.insertMany(sampleMilkCollections);
    console.log(`✅ Created ${createdCollections.length} milk collections`);
    
    // Create sample inventory batches
    console.log('📦 Creating sample inventory batches...');
    const sampleBatches = createdProducts.map((product, index) => ({
      product: product._id,
      batchNo: `BATCH-${Date.now()}-${index}`,
      quantity: Math.floor(Math.random() * 100) + 50,
      remaining: Math.floor(Math.random() * 50) + 25,
      expiryDate: new Date(Date.now() + (product.expiryDays * 24 * 60 * 60 * 1000)),
      supplier: 'Default Supplier',
      cost: product.price * 0.7, // Cost is 70% of selling price
      status: 'active'
    }));
    
    const createdBatches = await InventoryBatch.insertMany(sampleBatches);
    console.log(`✅ Created ${createdBatches.length} inventory batches`);
    
    // Create sample order
    const customerUser = createdUsers.find(user => user.role === 'customer');
    if (customerUser && createdProducts.length > 0) {
      console.log('📝 Creating sample order...');
      const sampleOrder = {
        user: customerUser._id,
        items: [
          {
            product: createdProducts[0]._id,
            quantity: 2,
            price: createdProducts[0].price,
            name: createdProducts[0].name
          },
          {
            product: createdProducts[1]._id,
            quantity: 1,
            price: createdProducts[1].price,
            name: createdProducts[1].name
          }
        ],
        total: (createdProducts[0].price * 2) + createdProducts[1].price,
        status: 'pending',
        shippingAddress: customerUser.addresses[0],
        paymentMethod: 'card',
        paymentStatus: 'pending',
        orderDate: new Date(),
        notes: 'Sample order for testing'
      };
      
      const createdOrder = await Order.create(sampleOrder);
      console.log(`✅ Created sample order: ${createdOrder._id}`);
    }
    
    console.log('\n🎉 Database initialization completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Products: ${createdProducts.length}`);
    console.log(`   Users: ${createdUsers.length}`);
    console.log(`   Milk Collections: ${createdCollections.length}`);
    console.log(`   Inventory Batches: ${createdBatches.length}`);
    console.log(`   Orders: 1`);
    
    // Display collections info
    console.log('\n📋 Created Collections:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    collections.forEach(collection => {
      console.log(`   - ${collection.name}`);
    });
    
    process.exit(0);
    
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
};

// Run initialization
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeDatabase();
}

export default initializeDatabase;