const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { protect } = require('../middlewares/auth.middleware');

// All routes require authentication
router.use(protect);

// Create order from cart
router.post('/', orderController.createOrder);

// Get all orders for user
router.get('/', orderController.getUserOrders);

// Get single order
router.get('/:id', orderController.getOrder);

// Cancel order
router.post('/:id/cancel', orderController.cancelOrder);

module.exports = router; 