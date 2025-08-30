import express from 'express';
import { auth } from '../middleware/auth';

const router = express.Router();

// Placeholder routes for users
router.post('/register', (req, res) => {
  res.json({ message: 'User registration endpoint' });
});

router.post('/login', (req, res) => {
  res.json({ message: 'User login endpoint' });
});

router.get('/profile', auth, (req, res) => {
  res.json({ message: 'User profile endpoint' });
});

export default router;
