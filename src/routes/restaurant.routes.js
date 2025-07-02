const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const restaurantCategoryController = require('../controllers/restaurantCategory.controller');
const dishController = require('../controllers/dish.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');
const upload = require('../middlewares/upload.middleware');
const { validateImage } = require('../middlewares/imageValidation.middleware');

// Restaurant Category Routes
router.get('/categories', protect, authorize('admin', 'restaurant_admin'), restaurantCategoryController.getAll);
router.get('/categories/:id', protect, authorize('admin', 'restaurant_admin'), restaurantCategoryController.getById);
router.post('/categories', protect, authorize('admin', 'restaurant_admin'), upload.single('image'), validateImage, restaurantCategoryController.create);
router.put('/categories/:id', protect, authorize('admin', 'restaurant_admin'), upload.single('image'), restaurantCategoryController.update);
router.delete('/categories/:id', protect, authorize('admin', 'restaurant_admin'), restaurantCategoryController.delete);

// Restaurant Routes
router.get('/', protect, authorize('admin', 'restaurant_admin'), restaurantController.getAll);
router.get('/:id', protect, authorize('admin', 'restaurant_admin'), restaurantController.getById);
router.post('/', protect, authorize('admin', 'restaurant_admin'), upload.single('image'), validateImage, restaurantController.create);
router.put('/:id', protect, authorize('admin', 'restaurant_admin'), upload.single('image'), restaurantController.update);
router.delete('/:id', protect, authorize('admin', 'restaurant_admin'), restaurantController.delete);

// Dish Routes
router.get('/dishes', protect, authorize('admin', 'restaurant_admin'), dishController.getAll);
router.get('/dishes/:id', protect, authorize('admin', 'restaurant_admin'), dishController.getById);
router.post('/dishes', protect, authorize('admin', 'restaurant_admin'), upload.single('image'), validateImage, dishController.create);
router.put('/dishes/:id', protect, authorize('admin', 'restaurant_admin'), upload.single('image'), dishController.update);
router.delete('/dishes/:id', protect, authorize('admin', 'restaurant_admin'), dishController.delete);

module.exports = router; 