const { Order, OrderItem, Cart, CartItem, Product, ProductVariation } = require('../models');
const { sequelize } = require('../models');

// Create order from cart
exports.createOrder = async (req, res) => {
  const transaction = await sequelize.transaction();
  
  try {
    const { shipping_address, payment_method } = req.body;
    
    // Get active cart
    const cart = await Cart.findOne({
      where: {
        user_id: req.user.id,
        status: 'active'
      },
      include: [{
        model: CartItem,
        as: 'items',
        include: [
          { model: Product, as: 'product' },
          { model: ProductVariation, as: 'variation' }
        ]
      }],
      transaction
    });

    if (!cart || !cart.items.length) {
      await transaction.rollback();
      return res.status(400).json({
        success: false,
        message: 'No active cart found or cart is empty'
      });
    }

    // Create order
    const order = await Order.create({
      user_id: req.user.id,
      total_amount: cart.total_amount,
      shipping_address,
      payment_method,
      payment_status: 'pending'
    }, { transaction });

    // Create order items
    const orderItems = await Promise.all(cart.items.map(item => {
      const productData = {
        name: item.product.name,
        sku: item.product.sku,
        price: item.price,
        variation: item.variation ? {
          sku: item.variation.sku,
          attributes: item.variation.attributes
        } : null
      };

      return OrderItem.create({
        order_id: order.id,
        product_id: item.product_id,
        variation_id: item.variation_id,
        quantity: item.quantity,
        price: item.price,
        total_price: item.total_price,
        product_data: productData
      }, { transaction });
    }));

    // Update cart status
    await cart.update({ status: 'completed' }, { transaction });

    await transaction.commit();

    // Fetch complete order with items
    const completeOrder = await Order.findByPk(order.id, {
      include: [{
        model: OrderItem,
        as: 'items'
      }]
    });

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: completeOrder
    });
  } catch (error) {
    await transaction.rollback();
    console.error('Order creation error:', error);
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

// Get user's orders
exports.getUserOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      where: { user_id: req.user.id },
      include: [{
        model: OrderItem,
        as: 'items'
      }],
      order: [['created_at', 'DESC']]
    });

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    console.error('Get orders error:', error);
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

// Get single order
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      },
      include: [{
        model: OrderItem,
        as: 'items'
      }]
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Get order error:', error);
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

// Cancel order
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findOne({
      where: {
        id: req.params.id,
        user_id: req.user.id
      }
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: 'Order cannot be cancelled in current status'
      });
    }

    await order.update({ status: 'cancelled' });

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
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