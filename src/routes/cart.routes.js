const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth.middleware');
const {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart
} = require('../controllers/cart.controller');

// All cart routes are protected (require authentication)
router.use(protect);

// Get user's cart
router.get('/', getCart);

// Add item to cart
router.post('/items', addItem);

// Update cart item quantity
router.put('/items/:itemId', updateItem);

// Remove item from cart
router.delete('/items/:itemId', removeItem);

// Clear cart
router.delete('/', clearCart);

module.exports = router; 