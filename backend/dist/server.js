"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables
dotenv_1.default.config();
// Import routes
const productRoutes_1 = __importDefault(require("./routes/productRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const cartRoutes_1 = __importDefault(require("./routes/cartRoutes"));
const orderRoutes_1 = __importDefault(require("./routes/orderRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const chatbotRoutes_1 = __importDefault(require("./routes/chatbotRoutes"));
// Import legacy JS routes - use require to avoid TypeScript issues
// import AllowanceRoutes from './routes/AllowanceRoutes.js';
// import AdditionalExpensesRoutes from './routes/finance_AdditionalExpensesRoutes.js';
// import SalarySlipRoutes from './routes/salarySlipRoutes.js';
// import InventoryDashboard from './routes/InventoryDashboard.js';
// import InventoryMilk from './routes/InventoryMilk.js';
// import InventoryOrders from './routes/InventoryOrders.js';
// import InventoryProducts from './routes/InventoryProducts.js';
// import InventoryRawMaterials from './routes/InventoryRawMaterials.js';
const app = (0, express_1.default)();
// Security middleware
app.use((0, helmet_1.default)());
// Rate limiting
const limiter = (0, express_rate_limit_1.default)({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: '10mb' }));
app.use(express_1.default.urlencoded({ extended: true, limit: '10mb' }));
// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date().toISOString() });
});
// Main API routes (TypeScript)
app.use('/api/products', productRoutes_1.default);
app.use('/api/auth', authRoutes_1.default);
app.use('/api/cart', cartRoutes_1.default);
app.use('/api/orders', orderRoutes_1.default);
app.use('/api/users', userRoutes_1.default);
app.use('/api/chatbot', chatbotRoutes_1.default);
// Legacy API routes (JavaScript) - Load dynamically to avoid TypeScript issues
try {
    const AllowanceRoutes = require('./routes/AllowanceRoutes.js');
    const AdditionalExpensesRoutes = require('./routes/finance_AdditionalExpensesRoutes.js');
    const SalarySlipRoutes = require('./routes/salarySlipRoutes.js');
    app.use('/api/allowances', AllowanceRoutes);
    app.use('/api/additional-expenses', AdditionalExpensesRoutes);
    app.use('/api/salary-slip', SalarySlipRoutes);
}
catch (error) {
    console.warn('⚠️  Some legacy finance routes could not be loaded:', error);
}
// Inventory API routes - Load dynamically
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
}
catch (error) {
    console.warn('⚠️  Some inventory routes could not be loaded:', error);
}
// Error handling middleware
app.use((err, req, res, next) => {
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
if (!MONGODB_URI) {
    console.error('❌ Error: MONGODB_URI is not defined in environment variables');
    process.exit(1);
}
mongoose_1.default.connect(MONGODB_URI, {
    dbName: process.env.MONGODB_DB || 'dairylicious'
})
    .then(() => {
    const conn = mongoose_1.default.connection;
    console.log(`✅ Connected to MongoDB: ${conn.name} on ${conn.host}`);
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
        console.log(`📚 API Documentation available at http://localhost:${PORT}/health`);
    });
})
    .catch((error) => {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
});
exports.default = app;
//# sourceMappingURL=server.js.map