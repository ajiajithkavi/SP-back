const express = require('express');
const router = express.Router();
const controller = require('../controllers/groceryOrder.controller');
const { protect } = require('../middlewares/auth.middleware');

// Protected routes (require authentication)
router.post('/', protect, controller.create);
router.get('/my-orders', protect, controller.getMyOrders);
router.get('/:id', protect, controller.getOne);
router.put('/:id', protect, controller.update);
router.patch('/:id/status', protect, controller.updateStatus);
router.delete('/:id', protect, controller.delete);

// Admin routes (get all orders)
router.get('/', protect, controller.getAll);

module.exports = router;
