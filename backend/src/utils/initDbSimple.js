const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const initDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get database connection
    const db = mongoose.connection.db;
    console.log('🔗 Database:', db.databaseName);

    // Create collections if they don't exist
    const collections = ['products', 'users', 'orders', 'milkcollections'];
    
    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      } catch (error) {
        if (error.code === 48) {
          console.log(`📁 Collection already exists: ${collectionName}`);
        } else {
          console.log(`⚠️ Error creating collection ${collectionName}:`, error.message);
        }
      }
    }

    // Sample data for products collection
    const products = [
      {
        name: 'Fresh Whole Milk',
        description: 'Premium quality whole milk from local farms',
        category: 'milk',
        price: 3.99,
        stock: 50,
        unit: 'liter',
        image: '/images/whole-milk.jpg',
        brand: 'FreshDairy',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Greek Yogurt',
        description: 'Creamy Greek yogurt with live cultures',
        category: 'yogurt',
        price: 5.99,
        stock: 30,
        unit: 'pack',
        image: '/images/greek-yogurt.jpg',
        brand: 'GreekGold',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Aged Cheddar Cheese',
        description: 'Sharp aged cheddar cheese, perfect for sandwiches',
        category: 'cheese',
        price: 8.99,
        stock: 25,
        unit: 'kg',
        image: '/images/cheddar-cheese.jpg',
        brand: 'CheeseComp',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Organic Butter',
        description: 'Creamy organic butter made from grass-fed cows',
        category: 'butter',
        price: 6.49,
        stock: 40,
        unit: 'pack',
        image: '/images/organic-butter.jpg',
        brand: 'OrganicFarm',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Vanilla Ice Cream',
        description: 'Premium vanilla ice cream made with real vanilla beans',
        category: 'ice-cream',
        price: 7.99,
        stock: 20,
        unit: 'carton',
        image: '/images/vanilla-ice-cream.jpg',
        brand: 'CreamyDelight',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Clear and insert products
    await db.collection('products').deleteMany({});
    const productResult = await db.collection('products').insertMany(products);
    console.log(`✅ Inserted ${productResult.insertedCount} products`);

    // Sample users
    const users = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'hashedpassword123',
        role: 'customer',
        address: {
          street: '123 Main St',
          city: 'Anytown',
          state: 'CA',
          zipCode: '12345',
          country: 'USA'
        },
        phone: '+1234567890',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Jane Smith',
        email: 'jane@example.com',
        password: 'hashedpassword456',
        role: 'customer',
        address: {
          street: '456 Oak Ave',
          city: 'Somewhere',
          state: 'NY',
          zipCode: '67890',
          country: 'USA'
        },
        phone: '+0987654321',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Admin User',
        email: 'admin@dairyshop.com',
        password: 'adminpassword789',
        role: 'admin',
        address: {
          street: '789 Admin Blvd',
          city: 'AdminCity',
          state: 'TX',
          zipCode: '11111',
          country: 'USA'
        },
        phone: '+1111111111',
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Clear and insert users
    await db.collection('users').deleteMany({});
    const userResult = await db.collection('users').insertMany(users);
    console.log(`✅ Inserted ${userResult.insertedCount} users`);

    // Sample orders
    const orders = [
      {
        userId: userResult.insertedIds[0],
        items: [
          {
            productId: productResult.insertedIds[0],
            quantity: 2,
            price: 3.99
          },
          {
            productId: productResult.insertedIds[1],
            quantity: 1,
            price: 5.99
          }
        ],
        totalAmount: 13.97,
        status: 'completed',
        paymentMethod: 'credit-card',
        paymentStatus: 'paid',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        userId: userResult.insertedIds[1],
        items: [
          {
            productId: productResult.insertedIds[2],
            quantity: 1,
            price: 8.99
          }
        ],
        totalAmount: 8.99,
        status: 'pending',
        paymentMethod: 'paypal',
        paymentStatus: 'pending',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Clear and insert orders
    await db.collection('orders').deleteMany({});
    const orderResult = await db.collection('orders').insertMany(orders);
    console.log(`✅ Inserted ${orderResult.insertedCount} orders`);

    // Sample milk collections
    const milkCollections = [
      {
        supplierId: 'FARM001',
        supplierName: 'Green Valley Farm',
        collectionDate: new Date(),
        quantity: 500,
        qualityGrade: 'A',
        fatContent: 3.8,
        proteinContent: 3.2,
        temperature: 4.2,
        price: 0.85,
        totalAmount: 425.00,
        status: 'accepted',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        supplierId: 'FARM002',
        supplierName: 'Sunny Meadows Dairy',
        collectionDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
        quantity: 750,
        qualityGrade: 'A+',
        fatContent: 4.0,
        proteinContent: 3.5,
        temperature: 3.8,
        price: 0.90,
        totalAmount: 675.00,
        status: 'accepted',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    // Clear and insert milk collections
    await db.collection('milkcollections').deleteMany({});
    const milkResult = await db.collection('milkcollections').insertMany(milkCollections);
    console.log(`✅ Inserted ${milkResult.insertedCount} milk collection records`);

    console.log('🎉 Database initialization completed successfully!');
    console.log('📊 Summary:');
    console.log(`   - Products: ${productResult.insertedCount}`);
    console.log(`   - Users: ${userResult.insertedCount}`);
    console.log(`   - Orders: ${orderResult.insertedCount}`);
    console.log(`   - Milk Collections: ${milkResult.insertedCount}`);

  } catch (error) {
    console.error('❌ Database initialization failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
  }
};

// Run the initialization
initDatabase();