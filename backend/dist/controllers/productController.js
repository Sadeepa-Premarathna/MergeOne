"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getCategories = exports.searchProducts = exports.getProductsByCategory = exports.getProductById = exports.getFeaturedProducts = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
// Get all products with filtering and pagination
const getProducts = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        // Build filter object
        const filter = {};
        if (req.query.category) {
            filter.category = req.query.category;
        }
        if (req.query.featured) {
            filter.featured = req.query.featured === 'true';
        }
        if (req.query.isOrganic) {
            filter.isOrganic = req.query.isOrganic === 'true';
        }
        if (req.query.minPrice || req.query.maxPrice) {
            filter.price = {};
            if (req.query.minPrice)
                filter.price.$gte = parseFloat(req.query.minPrice);
            if (req.query.maxPrice)
                filter.price.$lte = parseFloat(req.query.maxPrice);
        }
        if (req.query.search) {
            filter.$text = { $search: req.query.search };
        }
        // Sort options
        let sortOption = { createdAt: -1 };
        if (req.query.sortBy) {
            switch (req.query.sortBy) {
                case 'price-low':
                    sortOption = { price: 1 };
                    break;
                case 'price-high':
                    sortOption = { price: -1 };
                    break;
                case 'rating':
                    sortOption = { rating: -1 };
                    break;
                case 'name':
                    sortOption = { name: 1 };
                    break;
            }
        }
        const products = await Product_1.default.find(filter)
            .sort(sortOption)
            .skip(skip)
            .limit(limit);
        const total = await Product_1.default.countDocuments(filter);
        const totalPages = Math.ceil(total / limit);
        res.json({
            products,
            pagination: {
                currentPage: page,
                totalPages,
                totalProducts: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    }
    catch (error) {
        console.error('Get products error:', error);
        res.status(500).json({ message: 'Server error while fetching products' });
    }
};
exports.getProducts = getProducts;
// Get featured products
const getFeaturedProducts = async (req, res) => {
    try {
        const products = await Product_1.default.find({ featured: true })
            .sort({ rating: -1 })
            .limit(8);
        res.json(products);
    }
    catch (error) {
        console.error('Get featured products error:', error);
        res.status(500).json({ message: 'Server error while fetching featured products' });
    }
};
exports.getFeaturedProducts = getFeaturedProducts;
// Get single product
const getProductById = async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json(product);
    }
    catch (error) {
        console.error('Get product by ID error:', error);
        res.status(500).json({ message: 'Server error while fetching product' });
    }
};
exports.getProductById = getProductById;
// Get products by category
const getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        const products = await Product_1.default.find({ category })
            .sort({ rating: -1 })
            .skip(skip)
            .limit(limit);
        const total = await Product_1.default.countDocuments({ category });
        const totalPages = Math.ceil(total / limit);
        res.json({
            products,
            category,
            pagination: {
                currentPage: page,
                totalPages,
                totalProducts: total,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        });
    }
    catch (error) {
        console.error('Get products by category error:', error);
        res.status(500).json({ message: 'Server error while fetching products by category' });
    }
};
exports.getProductsByCategory = getProductsByCategory;
// Search products
const searchProducts = async (req, res) => {
    try {
        const { q } = req.query;
        if (!q) {
            return res.status(400).json({ message: 'Search query is required' });
        }
        const products = await Product_1.default.find({
            $or: [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { brand: { $regex: q, $options: 'i' } },
                { category: { $regex: q, $options: 'i' } }
            ]
        }).sort({ rating: -1 });
        res.json({
            products,
            searchQuery: q,
            resultsCount: products.length
        });
    }
    catch (error) {
        console.error('Search products error:', error);
        res.status(500).json({ message: 'Server error while searching products' });
    }
};
exports.searchProducts = searchProducts;
// Get product categories
const getCategories = async (req, res) => {
    try {
        const categories = await Product_1.default.distinct('category');
        const categoriesWithCount = await Promise.all(categories.map(async (category) => {
            const count = await Product_1.default.countDocuments({ category });
            return { name: category, count };
        }));
        res.json(categoriesWithCount);
    }
    catch (error) {
        console.error('Get categories error:', error);
        res.status(500).json({ message: 'Server error while fetching categories' });
    }
};
exports.getCategories = getCategories;
// Admin: Create product
const createProduct = async (req, res) => {
    try {
        const product = new Product_1.default(req.body);
        await product.save();
        res.status(201).json({
            message: 'Product created successfully',
            product
        });
    }
    catch (error) {
        console.error('Create product error:', error);
        res.status(400).json({
            message: 'Error creating product',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.createProduct = createProduct;
// Admin: Update product
const updateProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({
            message: 'Product updated successfully',
            product
        });
    }
    catch (error) {
        console.error('Update product error:', error);
        res.status(400).json({
            message: 'Error updating product',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};
exports.updateProduct = updateProduct;
// Admin: Delete product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product_1.default.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        console.error('Delete product error:', error);
        res.status(500).json({ message: 'Server error while deleting product' });
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=productController.js.map