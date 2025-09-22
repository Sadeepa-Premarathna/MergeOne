import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';

// GET list with filters: q, category, featured
export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, category, featured, limit = 10, page = 1 } = req.query;
    const filter: any = {};
    
    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { description: { $regex: q, $options: 'i' } },
        { brand: { $regex: q, $options: 'i' } },
      ];
    }
    if (category && category !== 'all') filter.category = category;
    if (featured !== undefined) filter.featured = featured === 'true';
    
    const skip = (Number(page) - 1) * Number(limit);
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(Number(limit))
      .skip(skip);
      
    const total = await Product.countDocuments(filter);
    
    res.json({
      products,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    next(err);
  }
};

export const getFeaturedProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await Product.find({ featured: true })
      .sort({ rating: -1 })
      .limit(8);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const getProductsByCategory = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category } = req.params;
    const { limit = 12 } = req.query;
    
    const products = await Product.find({ category })
      .sort({ rating: -1 })
      .limit(Number(limit));
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const searchProducts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { q, minPrice, maxPrice, category, sortBy = 'relevance' } = req.query;
    
    const filter: any = {};
    
    if (q) {
      filter.$text = { $search: q as string };
    }
    
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    
    if (category && category !== 'all') {
      filter.category = category;
    }
    
    let sortOption: any = {};
    switch (sortBy) {
      case 'price_low':
        sortOption = { price: 1 };
        break;
      case 'price_high':
        sortOption = { price: -1 };
        break;
      case 'rating':
        sortOption = { rating: -1 };
        break;
      case 'newest':
        sortOption = { createdAt: -1 };
        break;
      default:
        sortOption = q ? { score: { $meta: 'textScore' } } : { createdAt: -1 };
    }
    
    const products = await Product.find(filter).sort(sortOption);
    res.json(products);
  } catch (err) {
    next(err);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Product.distinct('category');
    const categoriesWithCount = await Promise.all(
      categories.map(async (category) => {
        const count = await Product.countDocuments({ category });
        return { name: category, count };
      })
    );
    res.json(categoriesWithCount);
  } catch (err) {
    next(err);
  }
};

export const createProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    next(err);
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};
