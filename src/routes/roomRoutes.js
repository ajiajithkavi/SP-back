'use strict';

const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');

// GET all rooms
router.get('/', roomController.getAllRooms);

// GET room by ID
router.get('/:id', roomController.getRoomById);

// POST create a new room
router.post('/', roomController.createRoom);

// PUT update a room
router.put('/:id', roomController.updateRoom);

// DELETE a room
router.delete('/:id', roomController.deleteRoom);

module.exports = router; 