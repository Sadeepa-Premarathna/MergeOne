import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import routes
import productRoutes from './routes/productRoutes';
import authRoutes from './routes/authRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import userRoutes from './routes/userRoutes';
import chatbotRoutes from './routes/chatbotRoutes';
import financeController from './controllers/financeController';
import hrController from './controllers/hrController';

// Import legacy JS routes - use require to avoid TypeScript issues
// import AllowanceRoutes from './routes/AllowanceRoutes.js';
// import AdditionalExpensesRoutes from './routes/finance_AdditionalExpensesRoutes.js';
// import SalarySlipRoutes from './routes/salarySlipRoutes.js';
// import InventoryDashboard from './routes/InventoryDashboard.js';
// import InventoryMilk from './routes/InventoryMilk.js';
// import InventoryOrders from './routes/InventoryOrders.js';
// import InventoryProducts from './routes/InventoryProducts.js';
// import InventoryRawMaterials from './routes/InventoryRawMaterials.js';

const app = express();

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Main API routes (TypeScript)
app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);
app.use('/api/chatbot', chatbotRoutes);
app.use('/api/finance', financeController);
app.use('/api/hr', hrController);

// Dashboard API endpoints for inventory
app.get('/api/dashboard/kpis', (req, res) => {
  const kpis = {
    totalProducts: 125,
    lowStockItems: 8,
    totalOrders: 342,
    monthlyRevenue: 287500.00,
    totalSuppliers: 15,
    outOfStockItems: 3,
    pendingOrders: 23,
    completedOrders: 319
  };
  res.json(kpis);
});

app.get('/api/dashboard/series', (req, res) => {
  const series = {
    sales: [
      { month: 'Jan', value: 245000 },
      { month: 'Feb', value: 267000 },
      { month: 'Mar', value: 289000 },
      { month: 'Apr', value: 301000 },
      { month: 'May', value: 278000 },
      { month: 'Jun', value: 312000 },
      { month: 'Jul', value: 295000 },
      { month: 'Aug', value: 287500 }
    ],
    inventory: [
      { category: 'Milk Products', count: 45 },
      { category: 'Dairy Products', count: 32 },
      { category: 'Raw Materials', count: 28 },
      { category: 'Equipment', count: 20 }
    ],
    orders: [
      { status: 'Pending', count: 23 },
      { status: 'Processing', count: 15 },
      { status: 'Shipped', count: 45 },
      { status: 'Delivered', count: 259 }
    ]
  };
  res.json(series);
});

// Legacy API routes (JavaScript) - Load dynamically to avoid TypeScript issues
// Temporarily disabled while fixing module compatibility
/*
try {
  const AllowanceRoutes = require('./routes/AllowanceRoutes.js');
  const AdditionalExpensesRoutes = require('./routes/finance_AdditionalExpensesRoutes.js');
  const SalarySlipRoutes = require('./routes/salarySlipRoutes.js');
  
  app.use('/api/allowances', AllowanceRoutes);
  app.use('/api/additional-expenses', AdditionalExpensesRoutes);
  app.use('/api/salary-slip', SalarySlipRoutes);
} catch (error) {
  console.warn('⚠️  Some legacy finance routes could not be loaded:', error);
}
*/

// Inventory API routes - Load dynamically
// Temporarily disabled while fixing module compatibility
/*
try {
  const InventoryDashboard = require('./routes/InventoryDashboard.js');
  const InventoryMilk = require('./routes/InventoryMilk.js');
  const InventoryOrders = require('./routes/InventoryOrders.js');
  const InventoryProducts = require('./routes/InventoryProducts.js');
  const InventoryRawMaterials = require('./routes/InventoryRawMaterials.js');
  
  app.use('/api/inventory/dashboard', InventoryDashboard);
  app.use('/api/inventory/milk', InventoryMilk);
  app.use('/api/inventory/orders', InventoryOrders);
  app.use('/api/inventory/products', InventoryProducts);
  app.use('/api/inventory/raw-materials', InventoryRawMaterials);
} catch (error) {
  console.warn('⚠️  Some inventory routes could not be loaded:', error);
}
*/

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'API endpoint not found' });
});

// Database connection and server startup
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

console.log('🚀 Starting server...');

// Start server immediately with fallback mode
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/health`);
  console.log(`🌐 Frontend should connect to: http://localhost:${PORT}/api`);
  console.log(`💡 Running in development mode with API fallbacks`);
});

// Try to connect to database asynchronously (non-blocking)
if (MONGODB_URI) {
  mongoose.connect(MONGODB_URI, {
    dbName: process.env.MONGODB_DB || 'test'
  })
  .then(() => {
    const conn = mongoose.connection;
    console.log(`✅ Connected to MongoDB: ${conn.name} on ${conn.host}`);
    console.log(`� Database: ${conn.db.databaseName}`);
  })
  .catch((error) => {
    console.error('❌ MongoDB connection error:', error.message);
    console.warn('⚠️  Server running without database connection - using mock data...');
  });
} else {
  console.warn('⚠️  No MONGODB_URI found - running with mock data only');
}

export default app;