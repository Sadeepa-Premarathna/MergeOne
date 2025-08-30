"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCartItemCount = exports.clearCart = exports.removeFromCart = exports.updateCartItem = exports.addToCart = exports.getCart = void 0;
const Cart_1 = __importDefault(require("../models/Cart"));
const Product_1 = __importDefault(require("../models/Product"));
// Get user's cart
const getCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        let cart = await Cart_1.default.findOne({ user: userId }).populate('items.product');
        if (!cart) {
            cart = new Cart_1.default({ user: userId, items: [], totalPrice: 0 });
            await cart.save();
        }
        res.json(cart);
    }
    catch (error) {
        console.error('Get cart error:', error);
        res.status(500).json({ message: 'Server error while fetching cart' });
    }
};
exports.getCart = getCart;
// Add item to cart
const addToCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { productId, quantity = 1 } = req.body;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        if (!productId) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        // Verify product exists and get its price
        const product = await Product_1.default.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        // Check stock availability
        if (product.stock < quantity) {
            return res.status(400).json({
                message: 'Insufficient stock',
                availableStock: product.stock
            });
        }
        let cart = await Cart_1.default.findOne({ user: userId });
        if (!cart) {
            cart = new Cart_1.default({ user: userId, items: [] });
        }
        // Check if item already exists in cart
        const existingItemIndex = cart.items.findIndex(item => item.product.toString() === productId);
        if (existingItemIndex > -1) {
            // Update quantity of existing item
            const newQuantity = cart.items[existingItemIndex].quantity + quantity;
            if (newQuantity > product.stock) {
                return res.status(400).json({
                    message: 'Cannot add more items than available stock',
                    availableStock: product.stock,
                    currentInCart: cart.items[existingItemIndex].quantity
                });
            }
            cart.items[existingItemIndex].quantity = newQuantity;
            cart.items[existingItemIndex].price = product.price;
        }
        else {
            // Add new item to cart
            cart.items.push({
                product: productId,
                quantity,
                price: product.price
            });
        }
        await cart.save();
        await cart.populate('items.product');
        res.json({
            message: 'Item added to cart successfully',
            cart
        });
    }
    catch (error) {
        console.error('Add to cart error:', error);
        res.status(500).json({ message: 'Server error while adding to cart' });
    }
};
exports.addToCart = addToCart;
// Update cart item quantity
const updateCartItem = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { productId, quantity } = req.body;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        if (!productId || quantity < 0) {
            return res.status(400).json({ message: 'Invalid product ID or quantity' });
        }
        const cart = await Cart_1.default.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        // If quantity is 0, remove the item
        if (quantity === 0) {
            cart.items = cart.items.filter(item => item.product.toString() !== productId);
        }
        else {
            // Check stock availability
            const product = await Product_1.default.findById(productId);
            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }
            if (product.stock < quantity) {
                return res.status(400).json({
                    message: 'Insufficient stock',
                    availableStock: product.stock
                });
            }
            // Update item quantity
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity = quantity;
                cart.items[itemIndex].price = product.price;
            }
            else {
                return res.status(404).json({ message: 'Item not found in cart' });
            }
        }
        await cart.save();
        await cart.populate('items.product');
        res.json({
            message: 'Cart updated successfully',
            cart
        });
    }
    catch (error) {
        console.error('Update cart error:', error);
        res.status(500).json({ message: 'Server error while updating cart' });
    }
};
exports.updateCartItem = updateCartItem;
// Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { productId } = req.params;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const cart = await Cart_1.default.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        await cart.populate('items.product');
        res.json({
            message: 'Item removed from cart successfully',
            cart
        });
    }
    catch (error) {
        console.error('Remove from cart error:', error);
        res.status(500).json({ message: 'Server error while removing from cart' });
    }
};
exports.removeFromCart = removeFromCart;
// Clear cart
const clearCart = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const cart = await Cart_1.default.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();
        res.json({
            message: 'Cart cleared successfully',
            cart
        });
    }
    catch (error) {
        console.error('Clear cart error:', error);
        res.status(500).json({ message: 'Server error while clearing cart' });
    }
};
exports.clearCart = clearCart;
// Get cart item count
const getCartItemCount = async (req, res) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const cart = await Cart_1.default.findOne({ user: userId });
        const itemCount = cart ? cart.items.reduce((total, item) => total + item.quantity, 0) : 0;
        res.json({ itemCount });
    }
    catch (error) {
        console.error('Get cart count error:', error);
        res.status(500).json({ message: 'Server error while getting cart count' });
    }
};
exports.getCartItemCount = getCartItemCount;
//# sourceMappingURL=cartController.js.map