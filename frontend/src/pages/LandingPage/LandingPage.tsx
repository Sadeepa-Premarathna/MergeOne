import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Paper,
} from '@mui/material';
import {
  Store as StoreIcon,
  AdminPanelSettings as AdminIcon,
  ShoppingCart as ShopIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #E8F5E8 0%, #F1F8E9 50%, #E8F5E8 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={6}>
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              color: '#2D5930',
              mb: 2,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
            }}
          >
            🥛 DairyLicious
          </Typography>
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{
              mb: 4,
              fontSize: { xs: '1.2rem', md: '1.5rem' },
              maxWidth: '600px',
              mx: 'auto',
            }}
          >
            Premium Dairy Products & Store Management System
          </Typography>
        </Box>

        <Grid container spacing={4} justifyContent="center">
          {/* Customer Shop Access */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={4}
              sx={{
                p: 0,
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                },
              }}
            >
              <Card sx={{ height: '100%', border: 'none', boxShadow: 'none' }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #7CB342, #66BB6A)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <StoreIcon sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                    Shop Now
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    Browse our premium dairy products including fresh milk, artisan cheeses, 
                    creamy yogurts, and more. Enjoy a seamless shopping experience with our 
                    modern e-commerce platform.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Typography variant="caption" sx={{ 
                      px: 2, 
                      py: 0.5, 
                      backgroundColor: '#E8F5E8', 
                      borderRadius: 10,
                      color: '#2D5930',
                      fontWeight: 500,
                    }}>
                      🧀 Artisan Cheese
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      px: 2, 
                      py: 0.5, 
                      backgroundColor: '#E8F5E8', 
                      borderRadius: 10,
                      color: '#2D5930',
                      fontWeight: 500,
                    }}>
                      🥛 Fresh Milk
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      px: 2, 
                      py: 0.5, 
                      backgroundColor: '#E8F5E8', 
                      borderRadius: 10,
                      color: '#2D5930',
                      fontWeight: 500,
                    }}>
                      🧈 Premium Butter
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 4, pt: 0 }}>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={() => navigate('/shop')}
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      background: 'linear-gradient(135deg, #7CB342, #66BB6A)',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #689F38, #558B2F)',
                      },
                    }}
                    startIcon={<ShopIcon />}
                  >
                    Enter Shop
                  </Button>
                </CardActions>
              </Card>
            </Paper>
          </Grid>

          {/* Admin Dashboard Access */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={4}
              sx={{
                p: 0,
                borderRadius: 3,
                overflow: 'hidden',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 12px 30px rgba(0,0,0,0.15)',
                },
              }}
            >
              <Card sx={{ height: '100%', border: 'none', boxShadow: 'none' }}>
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <Box
                    sx={{
                      width: 80,
                      height: 80,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2D5930, #1B3E1F)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      mx: 'auto',
                      mb: 3,
                    }}
                  >
                    <AdminIcon sx={{ fontSize: 40, color: 'white' }} />
                  </Box>
                  <Typography variant="h4" component="h2" gutterBottom sx={{ fontWeight: 600 }}>
                    Admin Panel
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                    Access the comprehensive business management system. Manage inventory, 
                    track orders, handle finances, HR operations, and monitor business 
                    analytics with powerful admin tools.
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center', flexWrap: 'wrap' }}>
                    <Typography variant="caption" sx={{ 
                      px: 2, 
                      py: 0.5, 
                      backgroundColor: '#F5F5F5', 
                      borderRadius: 10,
                      color: '#2D5930',
                      fontWeight: 500,
                    }}>
                      📊 Analytics
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      px: 2, 
                      py: 0.5, 
                      backgroundColor: '#F5F5F5', 
                      borderRadius: 10,
                      color: '#2D5930',
                      fontWeight: 500,
                    }}>
                      📦 Inventory
                    </Typography>
                    <Typography variant="caption" sx={{ 
                      px: 2, 
                      py: 0.5, 
                      backgroundColor: '#F5F5F5', 
                      borderRadius: 10,
                      color: '#2D5930',
                      fontWeight: 500,
                    }}>
                      💰 Finance
                    </Typography>
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 4, pt: 0 }}>
                  <Button
                    variant="outlined"
                    size="large"
                    fullWidth
                    onClick={() => navigate('/login')}
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      borderRadius: 2,
                      borderColor: '#2D5930',
                      color: '#2D5930',
                      '&:hover': {
                        borderColor: '#1B3E1F',
                        backgroundColor: '#F1F8E9',
                      },
                    }}
                    startIcon={<DashboardIcon />}
                  >
                    Admin Login
                  </Button>
                </CardActions>
              </Card>
            </Paper>
          </Grid>
        </Grid>

        <Box textAlign="center" mt={6}>
          <Typography variant="body2" color="text.secondary">
            Need help? Contact our support team or visit our documentation.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LandingPage;