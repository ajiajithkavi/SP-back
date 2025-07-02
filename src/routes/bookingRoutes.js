'use strict';

const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');
const { protect, authorize } = require('../middlewares/auth.middleware');

// GET all bookings
router.get('/', protect, authorize('admin', 'hotel_admin'), bookingController.getAllBookings);

// GET booking by ID
router.get('/:id', protect, authorize('admin', 'hotel_admin'), bookingController.getBookingById);

// POST create a new booking
router.post('/', protect, authorize('admin', 'hotel_admin'), bookingController.createBooking);

// PUT update a booking
router.put('/:id', protect, authorize('admin', 'hotel_admin'), bookingController.updateBooking);

// DELETE a booking
router.delete('/:id', protect, authorize('admin', 'hotel_admin'), bookingController.deleteBooking);

module.exports = router; 