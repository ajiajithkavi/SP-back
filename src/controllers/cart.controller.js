const { Cart, CartItem, Product, ProductVariation } = require('../models');

// Get user's active cart
exports.getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      where: {
        user_id: req.user.id,
        status: 'active'
      },
      include: [{
        model: CartItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product'
          },
          {
            model: ProductVariation,
            as: 'variation'
          }
        ]
      }]
    });

    if (!cart) {
      cart = await Cart.create({
        user_id: req.user.id,
        status: 'active'
      });
    }

    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message
    });
  }
};

// Add item to cart
exports.addItem = async (req, res) => {
  try {
    console.log('Adding item to cart:', {
      product_id: req.body.product_id,
      variation_id: req.body.variation_id,
      quantity: req.body.quantity,
      user_id: req.user?.id
    });

    const { product_id, variation_id, quantity } = req.body;

    // Log the database operations
    console.log('Validating product...');
    const product = await Product.findByPk(product_id);
    console.log('Product found:', product ? product.toJSON() : 'not found');

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Validate product exists
     product = await Product.findByPk(product_id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // If variation provided, validate it exists
    let variation = null;
    if (variation_id) {
      variation = await ProductVariation.findOne({
        where: {
          id: variation_id,
          product_id
        }
      });
      if (!variation) {
        return res.status(404).json({
          success: false,
          message: 'Product variation not found'
        });
      }
    }

    // Get or create active cart
    let cart = await Cart.findOne({
      where: {
        user_id: req.user.id,
        status: 'active'
      }
    });

    if (!cart) {
      cart = await Cart.create({
        user_id: req.user.id,
        status: 'active'
      });
    }

    // Check if item already exists in cart
    let cartItem = await CartItem.findOne({
      where: {
        cart_id: cart.id,
        product_id,
        variation_id: variation_id || null
      }
    });

    const price = variation ? variation.price : product.price;

    if (cartItem) {
      // Update quantity and total price
      cartItem = await cartItem.update({
        quantity: quantity || cartItem.quantity + 1,
        price,
        total_price: price * (quantity || cartItem.quantity + 1)
      });
    } else {
      // Create new cart item
      cartItem = await CartItem.create({
        cart_id: cart.id,
        product_id,
        variation_id: variation_id || null,
        quantity: quantity || 1,
        price,
        total_price: price * (quantity || 1)
      });
    }

    // Update cart total
    const cartItems = await CartItem.findAll({
      where: { cart_id: cart.id }
    });

    const total = cartItems.reduce((sum, item) => sum + Number(item.total_price), 0);
    await cart.update({ total_amount: total });

    // Fetch updated cart with items
    const updatedCart = await Cart.findByPk(cart.id, {
      include: [{
        model: CartItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product'
          },
          {
            model: ProductVariation,
            as: 'variation'
          }
        ]
      }]
    });

    res.json({
      success: true,
      message: 'Item added to cart successfully',
      data: updatedCart
    });
  } catch (error) {
    console.error('Error adding item to cart:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors ? error.errors.map(e => e.message) : error.message
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
      fullError: error
    });
  }
};

// Update cart item quantity
exports.updateItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    const cartItemId = req.params.itemId;

    const cartItem = await CartItem.findOne({
      where: { id: cartItemId },
      include: [
        {
          model: Cart,
          as: 'cart',
          where: { user_id: req.user.id, status: 'active' }
        }
      ]
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    if (quantity < 1) {
      await cartItem.destroy();
    } else {
      await cartItem.update({
        quantity,
        total_price: cartItem.price * quantity
      });
    }

    // Update cart total
    const cartItems = await CartItem.findAll({
      where: { cart_id: cartItem.cart_id }
    });

    const total = cartItems.reduce((sum, item) => sum + Number(item.total_price), 0);
    await cartItem.cart.update({ total_amount: total });

    // Fetch updated cart
    const updatedCart = await Cart.findByPk(cartItem.cart_id, {
      include: [{
        model: CartItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product'
          },
          {
            model: ProductVariation,
            as: 'variation'
          }
        ]
      }]
    });

    res.json({
      success: true,
      message: quantity < 1 ? 'Item removed from cart' : 'Cart item updated successfully',
      data: updatedCart
    });
  } catch (error) {
    console.error('Error updating cart item:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors ? error.errors.map(e => e.message) : error.message
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
      fullError: error
    });
  }
};

// Remove item from cart
exports.removeItem = async (req, res) => {
  try {
    const cartItemId = req.params.itemId;

    const cartItem = await CartItem.findOne({
      where: { id: cartItemId },
      include: [
        {
          model: Cart,
          as: 'cart',
          where: { user_id: req.user.id, status: 'active' }
        }
      ]
    });

    if (!cartItem) {
      return res.status(404).json({
        success: false,
        message: 'Cart item not found'
      });
    }

    const cartId = cartItem.cart_id;
    await cartItem.destroy();

    // Update cart total
    const cartItems = await CartItem.findAll({
      where: { cart_id: cartId }
    });

    const total = cartItems.reduce((sum, item) => sum + Number(item.total_price), 0);
    await cartItem.cart.update({ total_amount: total });

    // Fetch updated cart
    const updatedCart = await Cart.findByPk(cartId, {
      include: [{
        model: CartItem,
        as: 'items',
        include: [
          {
            model: Product,
            as: 'product'
          },
          {
            model: ProductVariation,
            as: 'variation'
          }
        ]
      }]
    });

    res.json({
      success: true,
      message: 'Item removed from cart successfully',
      data: updatedCart
    });
  } catch (error) {
    console.error('Error removing cart item:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors ? error.errors.map(e => e.message) : error.message
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
      fullError: error
    });
  }
};

// Clear cart
exports.clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      where: {
        user_id: req.user.id,
        status: 'active'
      }
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Active cart not found'
      });
    }

    await CartItem.destroy({
      where: { cart_id: cart.id }
    });

    await cart.update({ total_amount: 0 });

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: cart
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors ? error.errors.map(e => e.message) : error.message
      });
    }
    res.status(500).json({
      success: false,
      message: error.message,
      stack: error.stack,
      fullError: error
    });
  }
}; 