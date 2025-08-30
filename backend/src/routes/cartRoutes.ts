import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getCartItemCount
} from '../controllers/cartController';
import { auth } from '../middleware/auth';

const router = express.Router();

// All cart routes require authentication
router.use(auth);

router.get('/', getCart);
router.get('/count', getCartItemCount);
router.post('/add', addToCart);
router.put('/update', updateCartItem);
router.delete('/item/:productId', removeFromCart);
router.delete('/clear', clearCart);

export default router;
