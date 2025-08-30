import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Card,
  Chip,
  Rating,
  IconButton,
  Stack,
  Alert,
  Tooltip,
  Paper,
  List,
  ListItem,
  ListItemText,
  Tab,
  Tabs,
  CardMedia,
} from '@mui/material';
import {
  AddShoppingCart,
  Favorite,
  FavoriteBorder,
  Share,
  LocalShipping,
  VerifiedUser,
  Nature,
  Schedule,
  Star,
  ArrowBack,
  ReviewsOutlined,
  InfoOutlined,
  ShoppingBag,
  CalendarToday,
  CheckCircle,
  Warning,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../../types';
import { useCart } from '../../context/CartContext';

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);

  // Mock product images (in real app, product would have multiple images)
  const productImages = [
    product?.image || '',
    product?.image || '',
    product?.image || '',
  ];

  useEffect(() => {
    // Mock fetch product data
    const fetchProduct = async () => {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock product data
      const mockProduct: Product = {
        _id: id || '1',
        name: 'Premium Organic Whole Milk',
        description: 'Fresh, creamy organic whole milk sourced from grass-fed cows. Rich in essential nutrients, vitamins, and minerals. Perfect for drinking, cooking, or adding to your favorite beverages.',
        price: 4.99,
        category: 'milk',
        image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=500',
        stock: 25,
        unit: 'liter',
        brand: 'Green Valley Farms',
        expiryDays: 7,
        isOrganic: true,
        fatContent: 3.25,
        volume: 1,
        rating: 4.8,
        numReviews: 124,
        featured: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      setProduct(mockProduct);
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const getExpiryDate = () => {
    if (!product) return '';
    const today = new Date();
    const expiryDate = new Date(today.getTime() + product.expiryDays * 24 * 60 * 60 * 1000);
    return expiryDate.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getExpiryStatus = () => {
    if (!product) return { status: 'fresh', color: 'success', icon: <CheckCircle /> };
    
    if (product.expiryDays <= 2) {
      return { status: 'expires soon', color: 'warning', icon: <Warning /> };
    } else if (product.expiryDays <= 5) {
      return { status: 'consume soon', color: 'info', icon: <Schedule /> };
    }
    return { status: 'fresh', color: 'success', icon: <CheckCircle /> };
  };

  const handleAddToCart = async () => {
    if (!product) return;
    
    setIsAdding(true);
    
    for (let i = 0; i < quantity; i++) {
      addItem({
        _id: product._id,
        name: product.name,
        price: product.price,
        image: product.image,
        unit: product.unit,
        brand: product.brand,
      });
    }
    
    setTimeout(() => setIsAdding(false), 1000);
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <ShoppingBag sx={{ fontSize: 60, color: 'primary.main' }} />
        </motion.div>
      </Box>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Product not found</Alert>
      </Container>
    );
  }

  const expiryInfo = getExpiryStatus();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Back Button */}
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate(-1)}
          sx={{ mb: 3, textTransform: 'none' }}
        >
          Back to Products
        </Button>

        <Grid container spacing={4}>
          {/* Product Images */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                }}
              >
                <CardMedia
                  component="img"
                  height="400"
                  image={productImages[selectedImage]}
                  alt={product.name}
                  sx={{
                    objectFit: 'cover',
                    transition: 'transform 0.3s ease',
                    '&:hover': { transform: 'scale(1.05)' },
                  }}
                />
              </Card>
            </motion.div>

            {/* Image Thumbnails */}
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              {productImages.map((img, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    sx={{
                      width: 80,
                      height: 80,
                      cursor: 'pointer',
                      border: selectedImage === index ? '2px solid' : '1px solid',
                      borderColor: selectedImage === index ? 'primary.main' : 'grey.300',
                    }}
                    onClick={() => setSelectedImage(index)}
                  >
                    <CardMedia
                      component="img"
                      height="100%"
                      image={img}
                      alt={`${product.name} ${index + 1}`}
                      sx={{ objectFit: 'cover' }}
                    />
                  </Card>
                </motion.div>
              ))}
            </Stack>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ x: 50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {/* Brand */}
              <Typography
                variant="overline"
                sx={{
                  color: 'primary.main',
                  fontWeight: 600,
                  letterSpacing: 1,
                }}
              >
                {product.brand}
              </Typography>

              {/* Product Name */}
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  lineHeight: 1.2,
                }}
              >
                {product.name}
              </Typography>

              {/* Rating */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={product.rating} readOnly precision={0.1} />
                <Typography variant="body2" sx={{ ml: 1, color: 'text.secondary' }}>
                  ({product.numReviews} reviews)
                </Typography>
              </Box>

              {/* Price */}
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  color: 'primary.main',
                  mb: 2,
                }}
              >
                ${product.price.toFixed(2)}
                <Typography
                  component="span"
                  variant="body1"
                  sx={{ ml: 1, color: 'text.secondary', fontWeight: 400 }}
                >
                  per {product.unit}
                </Typography>
              </Typography>

              {/* Badges */}
              <Stack direction="row" spacing={1} sx={{ mb: 3 }}>
                {product.isOrganic && (
                  <Chip
                    icon={<Nature />}
                    label="Organic"
                    color="success"
                    variant="outlined"
                  />
                )}
                {product.featured && (
                  <Chip
                    icon={<Star />}
                    label="Featured"
                    sx={{ backgroundColor: '#FFD700', color: '#000' }}
                  />
                )}
                <Chip
                  icon={expiryInfo.icon}
                  label={`Expires: ${getExpiryDate()}`}
                  color={expiryInfo.color as any}
                  variant="outlined"
                />
              </Stack>

              {/* Expiry Alert */}
              {product.expiryDays <= 2 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Alert
                    severity="warning"
                    icon={<CalendarToday />}
                    sx={{ mb: 2 }}
                  >
                    This product expires in {product.expiryDays} day{product.expiryDays !== 1 ? 's' : ''}!
                  </Alert>
                </motion.div>
              )}

              {/* Description */}
              <Typography
                variant="body1"
                sx={{
                  color: 'text.secondary',
                  lineHeight: 1.6,
                  mb: 3,
                }}
              >
                {product.description}
              </Typography>

              {/* Product Details */}
              <Paper
                sx={{
                  p: 2,
                  mb: 3,
                  backgroundColor: 'grey.50',
                  borderRadius: 2,
                }}
              >
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Stock Available
                    </Typography>
                    <Typography variant="h6" color="success.main">
                      {product.stock} units
                    </Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="body2" color="text.secondary">
                      Fat Content
                    </Typography>
                    <Typography variant="h6">
                      {product.fatContent}%
                    </Typography>
                  </Grid>
                </Grid>
              </Paper>

              {/* Quantity and Actions */}
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    sx={{ minWidth: 40 }}
                  >
                    -
                  </Button>
                  <Typography
                    variant="h6"
                    sx={{
                      minWidth: 40,
                      textAlign: 'center',
                      fontWeight: 600,
                    }}
                  >
                    {quantity}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => setQuantity(quantity + 1)}
                    sx={{ minWidth: 40 }}
                  >
                    +
                  </Button>
                </Box>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{ flex: 1 }}
                >
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={
                      isAdding ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
                        >
                          <AddShoppingCart />
                        </motion.div>
                      ) : (
                        <AddShoppingCart />
                      )
                    }
                    onClick={handleAddToCart}
                    disabled={isAdding || product.stock === 0}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontWeight: 600,
                      background: isAdding
                        ? 'linear-gradient(45deg, #27AE60, #2ECC71)'
                        : 'linear-gradient(45deg, #3498DB, #2980B9)',
                      '&:hover': {
                        background: 'linear-gradient(45deg, #2980B9, #3498DB)',
                        boxShadow: '0 8px 25px rgba(52, 152, 219, 0.3)',
                      },
                    }}
                  >
                    {isAdding ? 'Adding...' : `Add ${quantity} to Cart`}
                  </Button>
                </motion.div>
              </Box>

              {/* Action Buttons */}
              <Stack direction="row" spacing={1}>
                <Tooltip title="Add to Favorites">
                  <IconButton
                    onClick={() => setIsFavorite(!isFavorite)}
                    sx={{
                      border: '1px solid',
                      borderColor: 'grey.300',
                      '&:hover': { borderColor: 'primary.main' },
                    }}
                  >
                    {isFavorite ? (
                      <Favorite sx={{ color: '#e91e63' }} />
                    ) : (
                      <FavoriteBorder />
                    )}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share Product">
                  <IconButton
                    sx={{
                      border: '1px solid',
                      borderColor: 'grey.300',
                      '&:hover': { borderColor: 'primary.main' },
                    }}
                  >
                    <Share />
                  </IconButton>
                </Tooltip>
              </Stack>
            </motion.div>
          </Grid>
        </Grid>

        {/* Product Tabs */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <Box sx={{ mt: 6 }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}
            >
              <Tab icon={<InfoOutlined />} label="Details" />
              <Tab icon={<ReviewsOutlined />} label="Reviews" />
              <Tab icon={<LocalShipping />} label="Shipping" />
            </Tabs>

            <AnimatePresence mode="wait">
              {tabValue === 0 && (
                <motion.div
                  key="details"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Product Information
                      </Typography>
                      <List>
                        <ListItem>
                          <ListItemText
                            primary="Category"
                            secondary={product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Volume"
                            secondary={`${product.volume} ${product.unit}`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Fat Content"
                            secondary={`${product.fatContent}%`}
                          />
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary="Shelf Life"
                            secondary={`${product.expiryDays} days from production`}
                          />
                        </ListItem>
                      </List>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      <Typography variant="h6" gutterBottom>
                        Features
                      </Typography>
                      <Stack spacing={1}>
                        {product.isOrganic && (
                          <Chip
                            icon={<Nature />}
                            label="Certified Organic"
                            color="success"
                            variant="outlined"
                          />
                        )}
                        <Chip
                          icon={<VerifiedUser />}
                          label="Quality Assured"
                          variant="outlined"
                        />
                        <Chip
                          icon={<LocalShipping />}
                          label="Fresh Delivery"
                          variant="outlined"
                        />
                      </Stack>
                    </Grid>
                  </Grid>
                </motion.div>
              )}

              {tabValue === 1 && (
                <motion.div
                  key="reviews"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h6" gutterBottom>
                    Customer Reviews
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Reviews functionality will be implemented here.
                  </Typography>
                </motion.div>
              )}

              {tabValue === 2 && (
                <motion.div
                  key="shipping"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Typography variant="h6" gutterBottom>
                    Shipping Information
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    Free delivery for orders over $50. Cold chain delivery ensures freshness.
                  </Typography>
                </motion.div>
              )}
            </AnimatePresence>
          </Box>
        </motion.div>
      </Container>
    </motion.div>
  );
};

export default ProductDetails;
