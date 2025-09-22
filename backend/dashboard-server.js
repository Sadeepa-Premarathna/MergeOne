const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Dashboard endpoints for inventory
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
  console.log('KPIs endpoint called');
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
  console.log('Series endpoint called');
  res.json(series);
});

app.get('/health', (req, res) => {
  res.json({ status: 'Dashboard API server running', timestamp: new Date() });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Dashboard API server running on http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});