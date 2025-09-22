# 🥛 DairyLicious - Dairy Shop Management System

A complete MERN stack application for dairy product e-commerce and business management.

## 🌟 Features

### Customer Shop
- **Beautiful Product Showcase**: Hero section with animated product cards
- **Product Categories**: Milk, Cheese, Yogurt, Butter, and more
- **Shopping Cart**: Add to cart, manage quantities, checkout process
- **Responsive Design**: Mobile-first approach with Material-UI
- **Smooth Animations**: Framer Motion animations throughout
- **No Login Required**: Browse products without authentication

### Admin Dashboard
- **Inventory Management**: Track products, raw materials, stock levels
- **Order Management**: Process orders, delivery tracking
- **Financial Management**: Track expenses, revenue, profit analysis
- **HR Management**: Employee data, attendance, payroll
- **Analytics & Reports**: Business insights and data visualization
- **Secure Access**: JWT-based authentication required

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sadeepa-Premarathna/MergeOne.git
   cd MergeOne
   ```

2. **Backend Setup**
   ```bash
   cd Backend
   npm install
   
   # Create .env file
   echo "MONGODB_URI=mongodb+srv://admin:zUwJYfxBUS1dfImJ@cluster0.82iazhd.mongodb.net/dairylicious" > .env
   echo "PORT=5000" >> .env
   echo "JWT_SECRET=your-secret-key-here" >> .env
   
   # Start backend server
   npm run dev
   ```

3. **Frontend Setup**
   ```bash
   cd Frontend
   npm install
   
   # Start frontend server
   npm start
   ```

## 🌐 Application URLs

### For Customers (No Login Required)
- **Main Landing Page**: http://localhost:3000/
- **Shop Homepage**: http://localhost:3000/shop
- **Product Catalog**: http://localhost:3000/shop/products
- **Product Details**: http://localhost:3000/shop/products/:id
- **Contact Page**: http://localhost:3000/shop/contact

### For Administrators (Login Required)
- **Admin Login**: http://localhost:3000/login
- **Admin Dashboard**: http://localhost:3000/admin
- **Inventory Management**: http://localhost:3000/app/dashboard
- **Financial Management**: http://localhost:3000/app/finance
- **HR Management**: http://localhost:3000/app/hr

### API Endpoints
- **Backend API**: http://localhost:5000/api
- **API Health Check**: http://localhost:5000/health

## 🛡️ Authentication Flow

### Customer Experience
1. **No Authentication Required**: Customers can browse products, view details, and contact information
2. **Login for Purchase**: Authentication required only for cart, checkout, and order tracking
3. **Guest Browsing**: Full product catalog accessible without account creation

### Admin Experience
1. **Secure Login**: JWT-based authentication required
2. **Role-Based Access**: Admin-only routes protected
3. **Session Management**: Auto-redirect to dashboard on successful login

## 🎨 Design Features

### Customer Shop
- **Modern UI**: Clean, professional design with dairy-themed colors
- **Animations**: Smooth transitions and hover effects
- **Product Cards**: Beautiful product showcase with images and pricing
- **Responsive Layout**: Perfect on desktop, tablet, and mobile
- **Fast Loading**: Optimized images and lazy loading

### Admin Dashboard
- **Professional Interface**: Clean, data-focused design
- **Real-time Updates**: Live data refresh and notifications
- **Data Visualization**: Charts, graphs, and analytics
- **Efficient Workflow**: Streamlined management processes

## 🗂️ Project Structure

```
DairyLicious/
├── Backend/                 # Node.js + Express + TypeScript
│   ├── src/
│   │   ├── controllers/     # Route controllers
│   │   ├── models/         # MongoDB models
│   │   ├── routes/         # API routes
│   │   ├── middleware/     # Auth & validation
│   │   └── utils/          # Helper functions
│   └── package.json
├── Frontend/               # React + TypeScript + Material-UI
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Helper functions
│   └── package.json
└── README.md
```

## 🛠️ Technology Stack

### Frontend
- **React 18** with TypeScript
- **Material-UI (MUI)** for components
- **React Router** for navigation
- **Framer Motion** for animations
- **TailwindCSS** for styling
- **Vite** for development and building

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Helmet** for security
- **CORS** for cross-origin requests

### Database
- **MongoDB Atlas** cloud database
- **Sample Data**: Pre-loaded with dairy products
- **Collections**: Products, Users, Orders, Categories

## 🔧 Development

### Running in Development Mode
```bash
# Backend (Terminal 1)
cd Backend
npm run dev

# Frontend (Terminal 2)  
cd Frontend
npm start
```

### Building for Production
```bash
# Frontend
cd Frontend
npm run build

# Backend
cd Backend
npm run build
```

### Testing
```bash
# Frontend tests
cd Frontend
npm test

# Backend tests
cd Backend
npm test
```

## 📊 Database Schema

### Products Collection
```javascript
{
  _id: ObjectId,
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  stock: Number,
  featured: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Users Collection
```javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  password: String (hashed),
  role: String, // 'customer' | 'admin'
  createdAt: Date,
  updatedAt: Date
}
```

### Orders Collection
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  items: Array,
  total: Number,
  status: String,
  deliveryAddress: Object,
  createdAt: Date,
  updatedAt: Date
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in the `/docs` folder

## 🎯 Roadmap

- [ ] Payment integration (Stripe/PayPal)
- [ ] Email notifications
- [ ] Advanced analytics
- [ ] Mobile app
- [ ] Multi-tenant support
- [ ] Inventory forecasting
- [ ] Customer loyalty program

---

**DairyLicious** - Bringing premium dairy products to your doorstep with modern technology! 🥛✨