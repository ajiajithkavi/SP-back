const express = require('express');
const router = express.Router();
const controller = require('../controllers/productAttribute.Controller');

// Create new attribute
router.post('/', controller.create);

// Get attributes for a product (updated path to avoid conflict)
router.get('/product/:product_id', controller.getByProduct);

// Update an attribute
router.put('/:id', controller.update);

// Delete an attribute
router.delete('/:id', controller.delete);

module.exports = router;
