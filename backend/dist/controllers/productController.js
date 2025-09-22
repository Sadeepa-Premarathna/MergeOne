"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getCategories = exports.searchProducts = exports.getProductsByCategory = exports.getProductById = exports.getFeaturedProducts = exports.getProducts = void 0;
const Product_1 = __importDefault(require("../models/Product"));
// GET list with filters: q, category, featured
const getProducts = async (req, res, next) => {
    try {
        const { q, category, featured, limit = 10, page = 1 } = req.query;
        const filter = {};
        if (q) {
            filter.$or = [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } },
                { brand: { $regex: q, $options: 'i' } },
            ];
        }
        if (category && category !== 'all')
            filter.category = category;
        if (featured !== undefined)
            filter.featured = featured === 'true';
        const skip = (Number(page) - 1) * Number(limit);
        const products = await Product_1.default.find(filter)
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip(skip);
        const total = await Product_1.default.countDocuments(filter);
        res.json({
            products,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                pages: Math.ceil(total / Number(limit))
            }
        });
    }
    catch (err) {
        next(err);
    }
};
exports.getProducts = getProducts;
const getFeaturedProducts = async (req, res, next) => {
    try {
        const products = await Product_1.default.find({ featured: true })
            .sort({ rating: -1 })
            .limit(8);
        res.json(products);
    }
    catch (err) {
        next(err);
    }
};
exports.getFeaturedProducts = getFeaturedProducts;
const getProductById = async (req, res, next) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    }
    catch (err) {
        next(err);
    }
};
exports.getProductById = getProductById;
const getProductsByCategory = async (req, res, next) => {
    try {
        const { category } = req.params;
        const { limit = 12 } = req.query;
        const products = await Product_1.default.find({ category })
            .sort({ rating: -1 })
            .limit(Number(limit));
        res.json(products);
    }
    catch (err) {
        next(err);
    }
};
exports.getProductsByCategory = getProductsByCategory;
const searchProducts = async (req, res, next) => {
    try {
        const { q, minPrice, maxPrice, category, sortBy = 'relevance' } = req.query;
        const filter = {};
        if (q) {
            filter.$text = { $search: q };
        }
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice)
                filter.price.$gte = Number(minPrice);
            if (maxPrice)
                filter.price.$lte = Number(maxPrice);
        }
        if (category && category !== 'all') {
            filter.category = category;
        }
        let sortOption = {};
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
        const products = await Product_1.default.find(filter).sort(sortOption);
        res.json(products);
    }
    catch (err) {
        next(err);
    }
};
exports.searchProducts = searchProducts;
const getCategories = async (req, res, next) => {
    try {
        const categories = await Product_1.default.distinct('category');
        const categoriesWithCount = await Promise.all(categories.map(async (category) => {
            const count = await Product_1.default.countDocuments({ category });
            return { name: category, count };
        }));
        res.json(categoriesWithCount);
    }
    catch (err) {
        next(err);
    }
};
exports.getCategories = getCategories;
const createProduct = async (req, res, next) => {
    try {
        const product = await Product_1.default.create(req.body);
        res.status(201).json(product);
    }
    catch (err) {
        next(err);
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res, next) => {
    try {
        const product = await Product_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        res.json(product);
    }
    catch (err) {
        next(err);
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product_1.default.findByIdAndDelete(req.params.id);
        if (!product)
            return res.status(404).json({ message: 'Product not found' });
        res.json({ message: 'Product deleted successfully' });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=productController.js.map