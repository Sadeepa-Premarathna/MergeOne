import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './InventoryDb.js';

// Import models from the new structure
import InventoryProduct from '../models/InventoryProduct.js';
import InventoryBatch from '../models/InventoryBatch.js';
import InventoryOrder from '../models/InventoryOrder.js';
import InventoryMilkCollection from '../models/InventoryMilkCollection.js';
import InventoryRawMaterial from '../models/InventoryRawMaterial.js';

function randomBetween(min, max) { return Math.random() * (max - min) + min; }
function randomInt(min, max) { return Math.floor(randomBetween(min, max)); }

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Connect to the test database
    await connectDB();
    console.log('✅ Connected to MongoDB test database');

    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await Promise.all([
      InventoryProduct.deleteMany({}),
      InventoryBatch.deleteMany({}),
      InventoryOrder.deleteMany({}),
      InventoryMilkCollection.deleteMany({}),
      InventoryRawMaterial.deleteMany({}),
    ]);

    // Seed Products
    console.log('📦 Seeding products...');
    const products = await InventoryProduct.insertMany([
      {
        name: 'Organic Whole Milk',
        description: 'Fresh organic whole milk from grass-fed cows',
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
        numReviews: 124,
        featured: true,
        reorderLevel: 10,
        isActive: true
      },
      {
        name: 'Greek Yogurt',
        description: 'Creamy Greek yogurt with live cultures',
        price: 3.49,
        category: 'dairy',
        image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
        stock: 75,
        unit: 'container',
        brand: 'FreshFarm',
        expiryDays: 14,
        isOrganic: false,
        protein: 15,
        rating: 4.6,
        numReviews: 89,
        featured: true,
        reorderLevel: 20,
        isActive: true
      },
      {
        name: 'Cheddar Cheese',
        description: 'Aged cheddar cheese with rich flavor',
        price: 7.99,
        category: 'cheese',
        image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400',
        stock: 30,
        unit: 'block',
        brand: 'CheeseWorks',
        expiryDays: 60,
        isOrganic: false,
        aging: '12 months',
        rating: 4.7,
        numReviews: 67,
        featured: false,
        reorderLevel: 5,
        isActive: true
      },
      {
        name: 'Organic Butter',
        description: 'Organic unsalted butter from cream',
        price: 5.99,
        category: 'dairy',
        image: 'https://images.unsplash.com/photo-1589985269047-0dbf5ab2d122?w=400',
        stock: 40,
        unit: 'block',
        brand: 'FreshFarm',
        expiryDays: 30,
        isOrganic: true,
        saltContent: 0,
        rating: 4.5,
        numReviews: 45,
        featured: false,
        reorderLevel: 8,
        isActive: true
      }
    ]);

    // Seed Raw Materials
    console.log('🥛 Seeding raw materials...');
    const rawMaterials = await InventoryRawMaterial.insertMany([
      {
        name: 'Fresh Milk',
        category: 'dairy',
        unit: 'liters',
        costPerUnit: 1.50,
        currentStock: 500,
        minimumStock: 100,
        supplier: 'Local Dairy Farm',
        expiryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        qualityGrade: 'A',
        isOrganic: true
      },
      {
        name: 'Milk Cultures',
        category: 'additives',
        unit: 'packages',
        costPerUnit: 25.00,
        currentStock: 20,
        minimumStock: 5,
        supplier: 'Culture Labs',
        expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days from now
        qualityGrade: 'Premium',
        isOrganic: false
      }
    ]);

    // Seed Milk Collections
    console.log('🚚 Seeding milk collections...');
    const milkCollections = await InventoryMilkCollection.insertMany([
      {
        farmerId: 'FARM001',
        farmerName: 'John Smith',
        collectionDate: new Date(),
        morningCollection: 120.5,
        eveningCollection: 98.3,
        totalVolume: 218.8,
        qualityGrade: 'A',
        fatContent: 3.8,
        proteinContent: 3.2,
        pricePerLiter: 1.45,
        totalAmount: 317.26,
        paymentStatus: 'pending',
        notes: 'High quality milk from grass-fed cows'
      },
      {
        farmerId: 'FARM002',
        farmerName: 'Mary Johnson',
        collectionDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        morningCollection: 95.0,
        eveningCollection: 87.5,
        totalVolume: 182.5,
        qualityGrade: 'A',
        fatContent: 3.6,
        proteinContent: 3.1,
        pricePerLiter: 1.45,
        totalAmount: 264.63,
        paymentStatus: 'paid',
        notes: 'Regular supplier with consistent quality'
      }
    ]);

    // Seed Orders
    console.log('📋 Seeding orders...');
    const orders = await InventoryOrder.insertMany([
      {
        orderNumber: 'ORD-001',
        customerName: 'Fresh Market Store',
        customerEmail: 'orders@freshmarket.com',
        customerPhone: '+1234567890',
        orderDate: new Date(),
        deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        items: [
          {
            product: products[0]._id,
            quantity: 10,
            unitPrice: 4.99,
            totalPrice: 49.90
          },
          {
            product: products[1]._id,
            quantity: 15,
            unitPrice: 3.49,
            totalPrice: 52.35
          }
        ],
        subtotal: 102.25,
        tax: 10.23,
        total: 112.48,
        status: 'pending',
        paymentStatus: 'pending',
        deliveryAddress: '123 Market Street, City, State 12345'
      }
    ]);

    // Seed Inventory Batches
    console.log('📦 Seeding inventory batches...');
    const batches = await InventoryBatch.insertMany([
      {
        product: products[0]._id,
        batchNumber: 'BATCH-001',
        quantity: 50,
        manufacturingDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        expiryDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        costPerUnit: 3.50,
        qualityGrade: 'A',
        supplier: 'FreshFarm',
        storageLocation: 'Cold Storage A1'
      },
      {
        product: products[1]._id,
        batchNumber: 'BATCH-002',
        quantity: 75,
        manufacturingDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
        expiryDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000), // 13 days from now
        costPerUnit: 2.20,
        qualityGrade: 'A',
        supplier: 'FreshFarm',
        storageLocation: 'Cold Storage B2'
      }
    ]);

    console.log('✅ Database seeding completed successfully!');
    console.log(`📊 Seeded:`);
    console.log(`   - ${products.length} products`);
    console.log(`   - ${rawMaterials.length} raw materials`);
    console.log(`   - ${milkCollections.length} milk collections`);
    console.log(`   - ${orders.length} orders`);
    console.log(`   - ${batches.length} inventory batches`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeder
seedDatabase();