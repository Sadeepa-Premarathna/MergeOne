import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';

// Context
import { CartProvider } from './context/CartContext';

// Components
import Navbar from './components/Navbar/Navbar';
import Footer from './components/Footer/Footer';
import FloatingCart from './components/FloatingCart/FloatingCart';
import Chatbot from './components/Chatbot/Chatbot';
import ProtectedRoute from './components/ProtectedRoute/ProtectedRoute';
import LandingPage from './pages/LandingPage/LandingPage';

// Pages
import Home from './pages/Home/Home';
import Products from './pages/Products/Products';
import ProductDetails from './pages/ProductDetails/ProductDetails';
import Cart from './pages/Cart/Cart';
import Checkout from './pages/Checkout/Checkout';
import OrderTracking from './pages/OrderTracking/OrderTracking';
import Orders from './pages/Orders/Orders';
import Contact from './pages/Contact/Contact';
import Login from './pages/Login/Login';

// Import Inventory Admin Components
import InventoryAdminDashboard from './pages/InventoryPages/InventoryAdminDashboard';
// Inventory module layout and pages
import AppLayout from './components/InventoryComponents/InventoryAppLayoutFixed.jsx';
import InventoryDashboard from './pages/InventoryPages/InventoryDashboard.jsx';
import InventoryProducts from './pages/InventoryPages/InventoryProducts.jsx';
import InventoryInventory from './pages/InventoryPages/InventoryInventory.jsx';
import InventoryRawMaterials from './pages/InventoryPages/InventoryRawMaterials.jsx';
import InventoryUsers from './pages/InventoryPages/InventoryUsers.jsx';
import InventoryReports from './pages/InventoryPages/InventoryReports.jsx';
import InventoryOrders from './pages/InventoryPages/InventoryOrders.jsx';
import InventoryDelivery from './pages/InventoryPages/InventoryDelivery.jsx';
// Finance & HR apps
import FinanceAppWithRouting from './FinanceAppWithRouting';
import SimpleHRApp from './SimpleHRApp';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

// Create theme with Poppins font
const theme = createTheme({
  typography: {
    fontFamily: [
      'Poppins',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 700,
    },
    h2: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
    },
    h3: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
    },
    h4: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
    },
    h5: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 500,
    },
    body1: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 400,
    },
    body2: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 400,
    },
    button: {
      fontFamily: 'Poppins, sans-serif',
      fontWeight: 500,
      textTransform: 'none',
    },
  },
  palette: {
    primary: {
      main: '#2D5930', // Deep forest green from logo
      light: '#4A7C59',
      dark: '#1B3E1F',
    },
    secondary: {
      main: '#7CB342', // Fresh green from logo
      light: '#A5D6A7',
      dark: '#558B2F',
    },
    success: {
      main: '#66BB6A', // Bright green accent
      light: '#81C784',
      dark: '#388E3C',
    },
    info: {
      main: '#26A69A', // Teal accent
      light: '#4DB6AC',
      dark: '#00695C',
    },
    background: {
      default: '#F1F8E9', // Very light green background
      paper: '#FFFFFF',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          fontFamily: 'Poppins, sans-serif',
          fontWeight: 500,
          textTransform: 'none',
          borderRadius: 8,
          padding: '10px 20px',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          fontFamily: 'Poppins, sans-serif',
          borderRadius: 12,
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontFamily: 'Poppins, sans-serif',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiInputBase-input': {
            fontFamily: 'Poppins, sans-serif',
          },
          '& .MuiInputLabel-root': {
            fontFamily: 'Poppins, sans-serif',
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontFamily: 'Poppins, sans-serif',
        },
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <CartProvider>
          <Router>
            <div className="App">
              <Routes>
                {/* Landing Page Route - Shows choice between Shop and Admin */}
                <Route 
                  path="/" 
                  element={<LandingPage />} 
                />
                
                {/* Login route - not protected, allows access for non-authenticated users */}
                <Route 
                  path="/login" 
                  element={<Login />} 
                />
                
                {/* Admin Dashboard route - Direct access without authentication */}
                <Route 
                  path="/admin" 
                  element={<InventoryAdminDashboard />} 
                />
                
                {/* Direct admin entry - No authentication required */}
                <Route 
                  path="/dashboard" 
                  element={<InventoryAdminDashboard />} 
                />
                
                {/* Management Module Routes - Direct access without authentication */}
                <Route
                  path="/app/*"
                  element={<AppLayout />}
                >
                  {/* Inventory nested routes */}
                  <Route index element={<InventoryDashboard />} />
                  <Route path="dashboard" element={<InventoryDashboard />} />
                  <Route path="raw-materials" element={<InventoryRawMaterials />} />
                  <Route path="products" element={<InventoryProducts />} />
                  <Route path="inventory" element={<InventoryInventory />} />
                  <Route path="users" element={<InventoryUsers />} />
                  <Route path="reports" element={<InventoryReports />} />
                  <Route path="orders" element={<InventoryOrders />} />
                  <Route path="delivery" element={<InventoryDelivery />} />
                </Route>

                {/* Finance & HR modules with nested routing - Direct access */}
                <Route
                  path="/app/finance/*"
                  element={<FinanceAppWithRouting />}
                />
                <Route
                  path="/app/hr/*"
                  element={<SimpleHRApp />}
                />
                
                {/* Customer Shop Routes - Publicly Accessible with Navbar/Footer */}
                <Route 
                  path="/shop/*" 
                  element={
                    <>
                      <Navbar />
                      <main style={{ minHeight: 'calc(100vh - 160px)', paddingTop: '120px' }}>
                        <Routes>
                          {/* Public shop routes - no authentication required */}
                          <Route path="/" element={<Home />} />
                          <Route path="/products" element={<Products />} />
                          <Route path="/products/:id" element={<ProductDetails />} />
                          <Route path="/contact" element={<Contact />} />
                          
                          {/* Protected routes requiring authentication for checkout/orders */}
                          <Route 
                            path="/cart" 
                            element={
                              <ProtectedRoute requireAuth>
                                <Cart />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/checkout" 
                            element={
                              <ProtectedRoute requireAuth>
                                <Checkout />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/orders" 
                            element={
                              <ProtectedRoute requireAuth>
                                <Orders />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/orders/track/:trackingNumber" 
                            element={
                              <ProtectedRoute requireAuth>
                                <OrderTracking />
                              </ProtectedRoute>
                            } 
                          />
                        </Routes>
                      </main>
                      <FloatingCart />
                      <Chatbot />
                      <Footer />
                    </>
                  } 
                />
                
                {/* Direct route to shop as default customer experience */}
                <Route path="/customer" element={<Home />} />
                <Route path="/store" element={<Home />} />
              </Routes>
              <Toaster 
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#363636',
                    color: '#fff',
                  },
                }}
              />
            </div>
          </Router>
        </CartProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
