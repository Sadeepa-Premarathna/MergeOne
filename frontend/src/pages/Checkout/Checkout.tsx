import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  ShoppingCart,
  LocationOn,
  Payment,
  CheckCircle,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../../context/CartContext';
import AddressStep from '../../components/Checkout/AddressStep';
import PaymentStep from '../../components/Checkout/PaymentStep';
import OrderSummary from '../../components/Checkout/OrderSummary';
import OrderConfirmation from '../../components/Checkout/OrderConfirmation';

export interface Address {
  id?: string;
  type: 'home' | 'work' | 'other';
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'cash' | 'digital_wallet';
  title: string;
  details?: string;
  icon?: string;
}

const steps = ['Cart Review', 'Delivery Address', 'Payment Method', 'Order Confirmation'];

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { state, clearCart } = useCart();
  const items = state.items;
  const totalPrice = state.totalPrice;
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod | null>(null);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  // Check if cart is empty
  useEffect(() => {
    if (items.length === 0 && activeStep === 0) {
      navigate('/cart');
    }
  }, [items, activeStep, navigate]);

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      // Place order
      await handlePlaceOrder();
    } else {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    
    try {
      // Simulate API call to place order
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const order = {
        id: `ORD-${Date.now()}`,
        items: items,
        totalAmount: totalPrice + 5.99, // Adding delivery fee
        deliveryFee: 5.99,
        address: selectedAddress,
        paymentMethod: selectedPayment,
        orderDate: new Date().toISOString(),
        estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'confirmed',
        trackingNumber: `TRK${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      };

      setOrderDetails(order);
      clearCart();
      setActiveStep(steps.length - 1);
    } catch (error) {
      console.error('Order placement failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const canProceed = () => {
    switch (activeStep) {
      case 0:
        return items.length > 0;
      case 1:
        return selectedAddress !== null;
      case 2:
        return selectedPayment !== null;
      default:
        return true;
    }
  };

  const getStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Card sx={{ mb: 3 }}>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Order Summary ({items.length} items)
                    </Typography>
                    <List>
                      {items.map((item, index) => (
                        <React.Fragment key={`${item._id}-${index}`}>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar
                                src={item.image}
                                alt={item.name}
                                sx={{ width: 60, height: 60 }}
                              />
                            </ListItemAvatar>
                            <ListItemText
                              primary={item.name}
                              secondary={`${item.brand} • ${item.unit}`}
                              sx={{ ml: 2 }}
                            />
                            <Box sx={{ textAlign: 'right', minWidth: 100 }}>
                              <Typography variant="body2" color="text.secondary">
                                Qty: {item.quantity}
                              </Typography>
                              <Typography variant="h6" color="primary">
                                ${(item.price * item.quantity).toFixed(2)}
                              </Typography>
                            </Box>
                          </ListItem>
                          {index < items.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12} md={4}>
                <OrderSummary />
              </Grid>
            </Grid>
          </motion.div>
        );
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <AddressStep
              selectedAddress={selectedAddress}
              onAddressSelect={setSelectedAddress}
            />
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <PaymentStep
                  selectedPayment={selectedPayment}
                  onPaymentSelect={setSelectedPayment}
                  totalAmount={totalPrice + 5.99}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Delivery Address
                    </Typography>
                    {selectedAddress && (
                      <Box>
                        <Typography variant="body2" color="text.secondary">
                          {selectedAddress.fullName}
                        </Typography>
                        <Typography variant="body2">
                          {selectedAddress.addressLine1}
                        </Typography>
                        {selectedAddress.addressLine2 && (
                          <Typography variant="body2">
                            {selectedAddress.addressLine2}
                          </Typography>
                        )}
                        <Typography variant="body2">
                          {selectedAddress.city}, {selectedAddress.state} {selectedAddress.zipCode}
                        </Typography>
                        <Typography variant="body2">
                          {selectedAddress.phone}
                        </Typography>
                      </Box>
                    )}
                    <Divider sx={{ my: 2 }} />
                    <OrderSummary />
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <OrderConfirmation orderDetails={orderDetails} />
          </motion.div>
        );
      default:
        return 'Unknown step';
    }
  };

  if (items.length === 0 && activeStep !== steps.length - 1) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">
          Your cart is empty. Please add items to proceed with checkout.
        </Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Checkout
        </Typography>
      </motion.div>

      <Paper sx={{ p: 3, mt: 3 }}>
        <Stepper
          activeStep={activeStep}
          sx={{ mb: 4 }}
          alternativeLabel
        >
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                icon={
                  index === 0 ? <ShoppingCart /> :
                  index === 1 ? <LocationOn /> :
                  index === 2 ? <Payment /> :
                  <CheckCircle />
                }
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {loading && (
          <Box sx={{ mb: 2 }}>
            <LinearProgress />
            <Typography align="center" sx={{ mt: 1 }}>
              Processing your order...
            </Typography>
          </Box>
        )}

        <AnimatePresence mode="wait">
          <Box sx={{ minHeight: 400 }}>
            {getStepContent(activeStep)}
          </Box>
        </AnimatePresence>

        {activeStep !== steps.length - 1 && (
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
            <Button
              onClick={handleBack}
              disabled={activeStep === 0 || loading}
              sx={{ mr: 1 }}
            >
              Back
            </Button>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="contained"
                onClick={handleNext}
                disabled={!canProceed() || loading}
                size="large"
                sx={{
                  minWidth: 120,
                  background: 'linear-gradient(45deg, #2E7D32, #4CAF50)',
                  '&:hover': {
                    background: 'linear-gradient(45deg, #1B5E20, #2E7D32)',
                  },
                }}
              >
                {activeStep === steps.length - 2 ? 'Place Order' : 'Next'}
              </Button>
            </motion.div>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Checkout;
