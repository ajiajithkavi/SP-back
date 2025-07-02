const express = require('express');
const router = express.Router();
const gcartController = require('../controllers/gcart.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', protect, gcartController.getCartItems);
router.post('/', protect, gcartController.addToCart);
// New routes for cart management
router.put('/:groceryId', protect, gcartController.updateCartItem);
router.delete('/:groceryId', protect, gcartController.removeCartItem);
router.post('/clear', protect, gcartController.clearCart);

module.exports = router;

