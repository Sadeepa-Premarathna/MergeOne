import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Grid,
  TextField,
  InputAdornment,
  Chip,
  FormControl,
  Select,
  MenuItem,
  Paper,
  Tabs,
  Tab,
  Button,
  Stack,
  CircularProgress,
} from '@mui/material';
import {
  Search,
  GridView,
  ViewList,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import ProductCard from '../../components/ProductCard/ProductCard';
import { Product } from '../../types';

// Mock product data with more variety
const mockProducts: Product[] = [
  {
    _id: '1',
    name: 'Organic Whole Milk',
    description: 'Fresh organic whole milk from grass-fed cows, rich in nutrients and natural flavor',
    price: 4.99,
    category: 'milk',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400',
    stock: 50,
    unit: 'liter',
    brand: 'FreshFarm',
    expiryDays: 7,
    isOrganic: true,
    fatContent: 3.5,
    volume: 1000,
    rating: 4.8,
    numReviews: 124,
    featured: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    _id: '2',
    name: 'Artisan Cheddar Cheese',
    description: 'Aged artisan cheddar cheese with rich, complex flavor profile',
    price: 12.99,
    category: 'cheese',
    image: 'https://images.unsplash.com/photo-1552767059-ce182ead6c1b?w=400',
    stock: 25,
    unit: 'kg',
    brand: 'CheeseWorks',
    expiryDays: 30,
    isOrganic: false,
    volume: 500,
    rating: 4.6,
    numReviews: 89,
    featured: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    _id: '3',
    name: 'Greek Yogurt',
    description: 'Creamy Greek yogurt packed with protein and probiotics',
    price: 3.99,
    category: 'yogurt',
    image: 'https://images.unsplash.com/photo-1571212059353-05d1e2c5c8b5?w=400',
    stock: 40,
    unit: 'pack',
    brand: 'GreekGold',
    expiryDays: 14,
    isOrganic: true,
    volume: 500,
    rating: 4.7,
    numReviews: 156,
    featured: true,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    _id: '4',
    name: 'Premium Butter',
    description: 'Premium unsalted butter made from the finest cream',
    price: 6.99,
    category: 'butter',
    image: 'https://images.unsplash.com/photo-1589985270826-4b7bb135bc9d?w=400',
    stock: 30,
    unit: 'pack',
    brand: 'CreamyDelight',
    expiryDays: 21,
    isOrganic: false,
    volume: 250,
    rating: 4.5,
    numReviews: 78,
    featured: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    _id: '5',
    name: 'Vanilla Ice Cream',
    description: 'Rich and creamy vanilla ice cream made with real vanilla beans',
    price: 8.99,
    category: 'ice-cream',
    image: 'https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400',
    stock: 20,
    unit: 'pack',
    brand: 'IceDream',
    expiryDays: 90,
    isOrganic: true,
    volume: 500,
    rating: 4.9,
    numReviews: 203,
    featured: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    _id: '6',
    name: 'Heavy Cream',
    description: 'Rich heavy cream perfect for cooking and baking',
    price: 5.49,
    category: 'cream',
    image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400',
    stock: 35,
    unit: 'liter',
    brand: 'FreshFarm',
    expiryDays: 10,
    isOrganic: false,
    volume: 500,
    rating: 4.4,
    numReviews: 67,
    featured: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    _id: '7',
    name: 'Mozzarella Cheese',
    description: 'Fresh mozzarella cheese, perfect for pizza and salads',
    price: 7.99,
    category: 'cheese',
    image: 'https://images.unsplash.com/photo-1586511925558-a4c6376fe65f?w=400',
    stock: 15,
    unit: 'pack',
    brand: 'ItalianStyle',
    expiryDays: 14,
    isOrganic: true,
    volume: 250,
    rating: 4.6,
    numReviews: 91,
    featured: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
  {
    _id: '8',
    name: 'Strawberry Yogurt',
    description: 'Delicious strawberry yogurt with real fruit pieces',
    price: 2.99,
    category: 'yogurt',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    stock: 60,
    unit: 'cup',
    brand: 'FruitDelight',
    expiryDays: 12,
    isOrganic: false,
    volume: 200,
    rating: 4.3,
    numReviews: 145,
    featured: false,
    createdAt: '2024-01-01',
    updatedAt: '2024-01-01',
  },
];

const categories = [
  { value: 'all', label: 'All Products' },
  { value: 'milk', label: 'Milk' },
  { value: 'cheese', label: 'Cheese' },
  { value: 'yogurt', label: 'Yogurt' },
  { value: 'butter', label: 'Butter' },
  { value: 'cream', label: 'Cream' },
  { value: 'ice-cream', label: 'Ice Cream' },
];

const sortOptions = [
  { value: 'name', label: 'Name' },
  { value: 'price-low', label: 'Price: Low to High' },
  { value: 'price-high', label: 'Price: High to Low' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'featured', label: 'Featured First' },
];

const Products: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [showOrganic, setShowOrganic] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [loading] = useState(false);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = mockProducts;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((product) => product.category === selectedCategory);
    }

    // Filter by organic
    if (showOrganic) {
      filtered = filtered.filter((product) => product.isOrganic);
    }

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'featured':
          return Number(b.featured) - Number(a.featured);
        default:
          return 0;
      }
    });

    return filtered;
  }, [searchQuery, selectedCategory, sortBy, showOrganic]);

  const handleProductClick = (productId: string) => {
    navigate(`/products/${productId}`);
  };

  return (
    <Box sx={{ backgroundColor: '#f8f9fa', minHeight: '100vh', pt: 4, pb: 6 }}>
      <Container maxWidth="xl">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Typography
              variant="h3"
              component="h1"
              gutterBottom
              sx={{
                fontWeight: 700,
                color: 'primary.dark',
                mb: 2,
              }}
            >
              Our Products
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: 'auto', mb: 4 }}
            >
              Discover our premium selection of fresh dairy products, sourced from the finest farms
            </Typography>
          </Box>
        </motion.div>

        {/* Filters and Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Paper
            elevation={0}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 3,
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'white',
            }}
          >
            <Grid container spacing={3} alignItems="center">
              {/* Search */}
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                    },
                  }}
                />
              </Grid>

              {/* Category Filter */}
              <Grid item xs={12} sm={6} md={2}>
                <Tabs
                  value={selectedCategory}
                  onChange={(_, value) => setSelectedCategory(value)}
                  variant="scrollable"
                  scrollButtons="auto"
                  sx={{ minHeight: 'auto' }}
                >
                  {categories.map((category) => (
                    <Tab
                      key={category.value}
                      label={category.label}
                      value={category.value}
                      sx={{
                        minHeight: 'auto',
                        py: 1,
                        fontSize: '0.875rem',
                        textTransform: 'none',
                      }}
                    />
                  ))}
                </Tabs>
              </Grid>

              {/* Sort */}
              <Grid item xs={12} sm={6} md={2}>
                <FormControl fullWidth size="small">
                  <Select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    displayEmpty
                    sx={{ borderRadius: 2 }}
                  >
                    {sortOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Filters */}
              <Grid item xs={12} md={4}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Button
                    variant={showOrganic ? 'contained' : 'outlined'}
                    size="small"
                    onClick={() => setShowOrganic(!showOrganic)}
                    sx={{ borderRadius: 2, textTransform: 'none' }}
                  >
                    Organic Only
                  </Button>
                  
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant={viewMode === 'grid' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setViewMode('grid')}
                      sx={{ minWidth: 40 }}
                    >
                      <GridView />
                    </Button>
                    <Button
                      variant={viewMode === 'list' ? 'contained' : 'outlined'}
                      size="small"
                      onClick={() => setViewMode('list')}
                      sx={{ minWidth: 40 }}
                    >
                      <ViewList />
                    </Button>
                  </Box>
                </Stack>
              </Grid>
            </Grid>
          </Paper>
        </motion.div>

        {/* Results Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body1" color="text.secondary">
              Showing {filteredProducts.length} of {mockProducts.length} products
            </Typography>
            
            {searchQuery && (
              <Chip
                label={`Search: "${searchQuery}"`}
                onDelete={() => setSearchQuery('')}
                color="primary"
                variant="outlined"
              />
            )}
          </Box>
        </motion.div>

        {/* Products Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress size={60} thickness={4} />
            </Box>
          ) : filteredProducts.length > 0 ? (
            <Grid container spacing={3}>
              {filteredProducts.map((product, index) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={viewMode === 'grid' ? 4 : 6}
                  lg={viewMode === 'grid' ? 3 : 4}
                  key={product._id}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={(id) => console.log('Add to cart:', id)}
                      onToggleFavorite={(id) => console.log('Toggle favorite:', id)}
                      onProductClick={handleProductClick}
                    />
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper
              sx={{
                p: 6,
                textAlign: 'center',
                borderRadius: 3,
                backgroundColor: 'white',
              }}
            >
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No products found
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search or filter criteria
              </Typography>
              <Button
                variant="outlined"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  setShowOrganic(false);
                }}
                sx={{ mt: 2 }}
              >
                Clear Filters
              </Button>
            </Paper>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default Products;
