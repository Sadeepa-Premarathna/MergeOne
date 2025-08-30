import Product from '../models/Product';

const sampleProducts = [
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
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
  },
  {
    name: 'Strawberry Yogurt',
    description: 'Delicious strawberry yogurt with real fruit pieces',
    price: 2.99,
    category: 'yogurt',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400',
    stock: 60,
    unit: 'pack',
    brand: 'FruitDelight',
    expiryDays: 12,
    isOrganic: false,
    volume: 200,
    rating: 4.3,
    numReviews: 145,
    featured: false,
  },
];

export const seedProducts = async () => {
  try {
    // Clear existing products
    await Product.deleteMany({});
    
    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Seeded ${products.length} products successfully`);
    
    return products;
  } catch (error) {
    console.error('❌ Error seeding products:', error);
    throw error;
  }
};

export default { seedProducts };
