import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));
app.use(morgan('dev'));

app.get('/api/health', (req: Request, res: Response) => {
  res.json({ ok: true, message: 'Server is running with TypeScript!' });
});

// Mock data endpoints
app.get('/api/products', (req: Request, res: Response) => {
  const mockProducts = [
    {
      _id: '1',
      name: 'Fresh Milk',
      sku: 'MILK-001',
      category: 'Dairy',
      price: 2.50,
      onHand: 100,
      reorderLevel: 20
    },
    {
      _id: '2',
      name: 'Greek Yogurt',
      sku: 'YOG-001',
      category: 'Dairy',
      price: 3.49,
      onHand: 75,
      reorderLevel: 15
    }
  ];
  res.json(mockProducts);
});

// Mock inventory stock summary used by Products page
app.get('/api/inventory/stock', (req: Request, res: Response) => {
  const stock = [
    { product: { _id: '1' }, onHand: 100 },
    { product: { _id: '2' }, onHand: 75 }
  ];
  res.json(stock);
});

// Mock dashboard endpoints used by UI store
app.get('/api/dashboard/kpis', (req: Request, res: Response) => {
  res.json({
    totalProducts: 2,
    totalRawMaterials: 3,
    lowStockProducts: 1,
    lowStockRawMaterials: 0,
    pendingOrders: 2,
    todayMilkCollection: 380,
    recentOrders: [
      { _id: 'o1', orderNumber: 'ORD-001', customerName: 'John', items: [], totalAmount: 1200, status: 'completed', orderDate: new Date().toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
    ],
    recentMilkCollections: []
  });
});

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

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err);
  const status = (err as any).status || 500;
  res.status(status).json({ message: err.message || 'Server error' });
});

const PORT = Number(process.env.PORT) || 8000;

function startServer() {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 TypeScript API server running on http://localhost:${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
  });
}

console.log('🔄 Starting server in mock data mode');
startServer();