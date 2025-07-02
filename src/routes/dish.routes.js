const express = require('express');
const router = express.Router();
const dishController = require('../controllers/dish.controller');
const upload = require('../middlewares/upload.middleware');
const { validateImage } = require('../middlewares/imageValidation.middleware');
const { protect, authorize } = require('../middlewares/auth.middleware');

// List all dishes (optionally filter by restaurantId)
router.get('/', dishController.getAll);
// Get dish by ID
router.get('/:id', dishController.getById);
// Create dish
router.post('/', protect, authorize('admin', 'restaurant_admin'), upload.single('image'), validateImage, dishController.create);
// Update dish
router.put('/:id', protect, authorize('admin', 'restaurant_admin'), upload.single('image'), dishController.update);
// Delete dish
router.delete('/:id', dishController.delete);

module.exports = router; 