const { GroceryOrder, GroceryOrderItem, User } = require('../models');

module.exports = {
  // Create Order
  async create(req, res) {
    try {
      const { total_amount, shipping_address, items } = req.body;
      const user_id = req.user.id; // Get user ID from authenticated token

      const order = await GroceryOrder.create({
        user_id,
        total_amount,
        shipping_address
      });

      const orderItems = items.map(item => ({
        ...item,
        order_id: order.id
      }));

      await GroceryOrderItem.bulkCreate(orderItems);

      res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Get Orders by User ID (for authenticated user)
  async getMyOrders(req, res) {
    try {
      const user_id = req.user.id; // Get user ID from authenticated token
      const orders = await GroceryOrder.findAll({ 
        where: { user_id },
        include: [{ model: GroceryOrderItem, as: 'items' }],
        order: [['created_at', 'DESC']]
      });
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Get All Orders
  async getAll(req, res) {
    try {
      const orders = await GroceryOrder.findAll({ include: [{ model: GroceryOrderItem, as: 'items' }] });
      res.status(200).json(orders);
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Get Single Order
  async getOne(req, res) {
    try {
      const { id } = req.params;
      const order = await GroceryOrder.findByPk(id, { 
        include: [
          { model: GroceryOrderItem, as: 'items' },
          { model: User,as: 'user', attributes: ['name', 'email'] }
        ]
      });

      if (!order) return res.status(404).json({ message: 'Order not found' });
      res.status(200).json(order);
    } catch (error) {
      console.error('Order fetch error:', error); // <--- Add this line
      res.status(500).json({ message: error.message, stack: error.stack });
    }
  },

  // Update Order
  async update(req, res) {
    try {
      const { id } = req.params;
      const { status, payment_status } = req.body;

      const order = await GroceryOrder.findByPk(id);
      if (!order) return res.status(404).json({ message: 'Order not found' });

      order.status = status ?? order.status;
      order.payment_status = payment_status ?? order.payment_status;
      await order.save();

      res.status(200).json({ message: 'Order updated', order });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Update Order Status
  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const order = await GroceryOrder.findByPk(id);
      if (!order) return res.status(404).json({ message: 'Order not found' });

      // Validate status
      const validStatuses = ['pending', 'processing', 'out_for_delivery', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
      }

      order.status = status;
      await order.save();

      res.status(200).json({ 
        message: 'Order status updated successfully', 
        order: {
          id: order.id,
          status: order.status,
          updated_at: order.updated_at
        }
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  },

  // Delete Order
  async delete(req, res) {
    try {
      const { id } = req.params;
      const order = await GroceryOrder.findByPk(id);
      if (!order) return res.status(404).json({ message: 'Order not found' });

      await GroceryOrderItem.destroy({ where: { order_id: id } });
      await order.destroy();

      res.status(200).json({ message: 'Order deleted' });
    } catch (error) {
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
};
