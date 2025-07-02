const { GCartItem } = require('../models');

exports.getCartItems = async (req, res) => {
  try {
    const userId = req.user.id;

    const items = await GCartItem.findAll({
      where: { user_id: userId }
    });

    res.json(items);
  } catch (error) {
    console.error('❌ Error fetching GCartItems:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      groceryId,
      name,
      image,
      category,
      original_price,
      discounted_price,
      quantity
    } = req.body;

    const [item, created] = await GCartItem.findOrCreate({
      where: { user_id: userId, grocery_id: groceryId },
      defaults: {
        name,
        image,
        category,
        original_price,
        discounted_price,
        quantity
      }
    });

    if (!created) {
      item.quantity += quantity;
      await item.save();
    }

    res.status(201).json(item);
  } catch (error) {
    console.error('❌ Error adding to GCartItem:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const groceryId = req.params.groceryId;
    const { quantity } = req.body;
    if (typeof quantity !== 'number' || quantity < 1) {
      return res.status(400).json({ error: 'Quantity must be a positive number.' });
    }
    const item = await GCartItem.findOne({ where: { user_id: userId, grocery_id: groceryId } });
    if (!item) {
      return res.status(404).json({ error: 'Cart item not found.' });
    }
    item.quantity = quantity;
    await item.save();
    res.json(item);
  } catch (error) {
    console.error('❌ Error updating GCartItem:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const groceryId = req.params.groceryId;
    const deleted = await GCartItem.destroy({ where: { user_id: userId, grocery_id: groceryId } });
    if (!deleted) {
      return res.status(404).json({ error: 'Cart item not found.' });
    }
    res.json({ message: 'Cart item removed.' });
  } catch (error) {
    console.error('❌ Error removing GCartItem:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    await GCartItem.destroy({ where: { user_id: userId } });
    res.json({ message: 'Cart cleared.' });
  } catch (error) {
    console.error('❌ Error clearing GCartItems:', error);
    res.status(500).json({ error: error.message });
  }
};
