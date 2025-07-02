const { TaxiRide, TaxiDriver, TaxiVehicle, User } = require('../models');

module.exports = {
  // List all rides (optionally filter by user_id, driver_id, vehicle_id)
  async getAll(req, res) {
    try {
      const where = {};
      if (req.query.user_id) where.user_id = req.query.user_id;
      if (req.query.driver_id) where.driver_id = req.query.driver_id;
      if (req.query.vehicle_id) where.vehicle_id = req.query.vehicle_id;
      const rides = await TaxiRide.findAll({
        where,
        include: [
          { model: TaxiDriver, as: 'driver' },
          { model: TaxiVehicle, as: 'vehicle' },
          { model: User, as: 'user' }
        ],
        order: [['createdAt', 'DESC']]
      });
      res.json({ success: true, data: rides });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error fetching taxi rides', error: err.message });
    }
  },

  // Get ride by ID
  async getById(req, res) {
    try {
      const ride = await TaxiRide.findByPk(req.params.id, {
        include: [
          { model: TaxiDriver, as: 'driver' },
          { model: TaxiVehicle, as: 'vehicle' },
          { model: User, as: 'user' }
        ]
      });
      if (!ride) return res.status(404).json({ success: false, message: 'Taxi ride not found' });
      res.json({ success: true, data: ride });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error fetching taxi ride', error: err.message });
    }
  },

  // Create ride
  async create(req, res) {
    try {
      const { user_id, driver_id, vehicle_id, pickup_location, dropoff_location, fare, status, requested_at, started_at, completed_at } = req.body;
      const ride = await TaxiRide.create({ 
        user_id, 
        driver_id, 
        vehicle_id, 
        pickup_location, 
        dropoff_location, 
        fare, 
        status, 
        requested_at, 
        started_at, 
        completed_at 
      });
      res.status(201).json({ success: true, message: 'Taxi ride created successfully', data: ride });
    } catch (err) {
      res.status(400).json({ success: false, message: 'Error creating taxi ride', error: err.message });
    }
  },

  // Update ride
  async update(req, res) {
    try {
      const { user_id, driver_id, vehicle_id, pickup_location, dropoff_location, fare, status, requested_at, started_at, completed_at } = req.body;
      const ride = await TaxiRide.findByPk(req.params.id);
      if (!ride) return res.status(404).json({ success: false, message: 'Taxi ride not found' });
      await ride.update({ 
        user_id, 
        driver_id, 
        vehicle_id, 
        pickup_location, 
        dropoff_location, 
        fare, 
        status, 
        requested_at, 
        started_at, 
        completed_at 
      });
      res.json({ success: true, message: 'Taxi ride updated successfully', data: ride });
    } catch (err) {
      res.status(400).json({ success: false, message: 'Error updating taxi ride', error: err.message });
    }
  },

  // Delete ride
  async delete(req, res) {
    try {
      const ride = await TaxiRide.findByPk(req.params.id);
      if (!ride) return res.status(404).json({ success: false, message: 'Taxi ride not found' });
      await ride.destroy();
      res.json({ success: true, message: 'Taxi ride deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error deleting taxi ride', error: err.message });
    }
  }
}; 