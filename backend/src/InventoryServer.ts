import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
// mongoose imported below was duplicated; keep a single import
import morgan from 'morgan';
import cors from 'cors';
import { connectDB } from './utils/InventoryDb';

// Import routes (using require for JS files)
const dashboardRoutes = require('./routes/InventoryDashboard.js');
const milkRoutes = require('./routes/InventoryMilk.js');
const orderRoutes = require('./routes/InventoryOrders.js');
const productRoutes = require('./routes/InventoryProducts.js');
const rawMaterialRoutes = require('./routes/InventoryRawMaterials.js');
import mongoose from 'mongoose';

const app = express();

app.use(express.json());
// Dev-friendly CORS: allow localhost and LAN IPs
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));
function registerMockEndpoints() {
  // Mock dashboard KPIs
  app.get('/api/dashboard/kpis', (req: Request, res: Response) => {
    res.json({
      totalProducts: 6,
      totalOnHandUnits: 420,
      lowStockCount: 2,
      nearExpiryCount: 1,
      todayOrders: 5,
      todayRevenue: 1250,
      todayMilkLiters: 380,
      monthRevenue: 22850,
    });
  });

  // Mock dashboard series
  app.get('/api/dashboard/series', (req: Request, res: Response) => {
    const today = new Date();
    const mkDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().slice(0,10);
    const revenueLast30Days = Array.from({ length: 14 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (13 - i));
      return { date: mkDate(d), total: Math.round(500 + Math.random() * 1500) };
    });
    const milkLast14Days = Array.from({ length: 14 }).map((_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (13 - i));
      return { date: mkDate(d), liters: Math.round(200 + Math.random() * 300) };
    });
    const top5LowStock = [
      { product: { name: 'Butter 250g', sku: 'BUT-250' }, onHand: 12 },
      { product: { name: 'Yogurt Plain 1L', sku: 'YOG-1L' }, onHand: 15 },
      { product: { name: 'Cheese Cheddar', sku: 'CHE-CHED' }, onHand: 20 },
      { product: { name: 'Curd 500g', sku: 'CUR-500' }, onHand: 25 },
      { product: { name: 'Fresh Milk 1L', sku: 'MIL-1L' }, onHand: 28 },
    ];
    const nearExpiryTable = [
      { product: 'Fresh Milk 1L', batchNo: 'B-001', expiryDate: new Date(Date.now()+7*86400000), remaining: 30 },
    ];
    const recentOrders = [
      { _id: 'o1', createdAt: new Date(), total: 2500, itemsCount: 5 },
      { _id: 'o2', createdAt: new Date(), total: 1800, itemsCount: 3 },
    ];
    res.json({ revenueLast30Days, milkLast14Days, top5LowStock, nearExpiryTable, recentOrders });
  });

  // Mock products list
  app.get('/api/products', (req: Request, res: Response) => {
    const mockProducts = [
      { _id: 'p1', name: 'Fresh Milk 1L', sku: 'MIL-1L', category: 'Dairy', unit: 'L', price: 250, supplier: 'DairyCo', reorderLevel: 20, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { _id: 'p2', name: 'Yogurt Plain 1L', sku: 'YOG-1L', category: 'Dairy', unit: 'L', price: 300, supplier: 'DairyCo', reorderLevel: 15, isActive: true, createdAt: new Date(), updatedAt: new Date() },
      { _id: 'p3', name: 'Butter 250g', sku: 'BUT-250', category: 'Dairy', unit: 'pcs', price: 450, supplier: 'DairyCo', reorderLevel: 10, isActive: true, createdAt: new Date(), updatedAt: new Date() },
    ];
    res.json(mockProducts);
  });

  // Mock inventory stock summary used by Products page
  app.get('/api/inventory/stock', (req: Request, res: Response) => {
    const stock = [
      { product: { _id: 'p1' }, onHand: 120 },
      { product: { _id: 'p2' }, onHand: 85 },
      { product: { _id: 'p3' }, onHand: 18 },
    ];
    res.json(stock);
  });
}

// We'll register routes after DB connection attempt to avoid overshadowing with mocks

app.get('/api/health', (req: Request, res: Response) => 
  res.json({ ok: true, message: 'Server is running with TypeScript!' })
);

// DB health endpoint
app.get('/api/health/db', (req: Request, res: Response) => {
  const state = mongoose.connection.readyState; // 0=disconnected,1=connected,2=connecting,3=disconnecting
  const states: Record<number, string> = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    ok: state === 1,
    state: states[state] || String(state),
    db: mongoose.connection.db?.databaseName || null
  });
});

// Database health endpoint
app.get('/api/health/db', (req: Request, res: Response) => {
  const state = mongoose.connection.readyState; // 0=disconnected 1=connected 2=connecting 3=disconnecting
  const states: Record<number, string> = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' };
  res.json({
    connected: state === 1,
    state: states[state] || String(state),
    database: mongoose.connection.db?.databaseName || null
  });
});

// Mock data endpoints
app.get('/api/products/mock', (req: Request, res: Response) => {
  const mockProducts = [
    {
      _id: '1',
      name: 'Fresh Milk',
      sku: 'MILK-001',
      category: 'Dairy',
      price: 2.50,
      onHand: 100,
      reorderLevel: 20
    }
  ];
  res.json(mockProducts);
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  const status = (err as any).status || 500;
  res.status(status).json({ message: err.message || 'Server error' });
});

const PORT = process.env.PORT || 8000;

// Try to connect to MongoDB, but don't block server start if it fails
(async () => {
  try {
    const conn = await connectDB();
    console.log('🗄️ Using live MongoDB connection');
    // Register DB-backed routes
    app.use('/api/dashboard', dashboardRoutes);
    app.use('/api/milk', milkRoutes);
    app.use('/api/orders', orderRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/raw-materials', rawMaterialRoutes);
  } catch (err) {
    console.log('⚠️ Proceeding without MongoDB (mock mode)');
    // Register mock endpoints only when DB is unavailable
    registerMockEndpoints();
  } finally {
    startServer();
  }
})();

function startServer() {
  app.listen(PORT, () => {
    console.log(`🚀 TypeScript API server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  });
}
