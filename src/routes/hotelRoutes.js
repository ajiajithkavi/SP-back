'use strict';

const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelController');

// GET all hotels
router.get('/', hotelController.getAllHotels);

// GET hotel by ID
router.get('/:id', hotelController.getHotelById);

// POST create a new hotel
router.post('/', hotelController.createHotel);

// PUT update a hotel
router.put('/:id', hotelController.updateHotel);

// DELETE a hotel
router.delete('/:id', hotelController.deleteHotel);

module.exports = router; 