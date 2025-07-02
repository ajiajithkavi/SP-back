const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middlewares/auth.middleware');
const taxiRideController = require('../controllers/taxiRide.controller');

// List all rides (optionally filter by user_id, driver_id, vehicle_id)
router.get('/', protect, authorize('admin', 'taxi_admin'), taxiRideController.getAll);
// Get ride by ID
router.get('/:id', protect, authorize('admin', 'taxi_admin'), taxiRideController.getById);
// Create ride
router.post('/', protect, authorize('admin', 'taxi_admin'), taxiRideController.create);
// Update ride
router.put('/:id', protect, authorize('admin', 'taxi_admin'), taxiRideController.update);
// Delete ride
router.delete('/:id', protect, authorize('admin', 'taxi_admin'), taxiRideController.delete);

module.exports = router; 