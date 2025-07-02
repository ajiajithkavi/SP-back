// src/routes/gwishlist.routes.js
const express = require('express');
const router  = express.Router();

const { Gwhishlist } = require('../models');            // Sequelize model
const { protect }   = require('../middlewares/auth.middleware'); // JWT‑auth middleware

// ---------------------------------------------------------------------------
// ➕ POST /api/gwishlist       – Add an item to the wishlist
// ---------------------------------------------------------------------------
// ➕ Add to wishlist
// ➕ Add to wishlist
router.post('/', protect, async (req, res) => {
  const { grocery_id, name, image, category, original_price, discounted_price, quantity } = req.body;
  const user_id = req.user.id;

  try {
    const existing = await Gwhishlist.findOne({
      where: { user_id, grocery_id }
    });

    if (existing) {
      return res.status(200).json(existing); // 🟩 Return the existing row
    }

    const newItem = await Gwhishlist.create({
      user_id,
      grocery_id,
      name,
      image,
      category,
      original_price,
      discounted_price,
      quantity
    });

    res.status(201).json(newItem); // ✅ Return full row
  } catch (error) {
    console.error('Add wishlist error:', error);
    res.status(500).json({ error: 'Database error' });
  }
});



// ---------------------------------------------------------------------------
// 🔁 GET /api/gwishlist        – Fetch all wishlist items for logged‑in user
// ---------------------------------------------------------------------------
router.get('/', protect, async (req, res) => {
  try {
    const items = await Gwhishlist.findAll({
      where: { user_id: req.user.id },
      order: [['created_at', 'DESC']]
    });
    res.json(items);
  } catch (err) {
    console.error('Fetch‑wishlist error:', err);
    res.status(500).json({ error: 'Failed to fetch wishlist' });
  }
});

// ---------------------------------------------------------------------------
// ❌ DELETE /api/gwishlist/:id – Remove a single item from the wishlist
// ---------------------------------------------------------------------------
router.delete('/:id', protect, async (req, res) => {
  try {
    const deleted = await Gwhishlist.destroy({
      where: { id: req.params.id, user_id: req.user.id }
    });

    if (deleted) {
      return res.json({ message: 'Removed from wishlist' });
    }
    res.status(404).json({ error: 'Item not found' });
  } catch (err) {
    console.error('Delete‑wishlist error:', err);
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

module.exports = router;
