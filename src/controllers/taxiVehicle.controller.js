const { TaxiVehicle, TaxiDriver } = require('../models');

module.exports = {
  // List all vehicles
  async getAll(req, res) {
    try {
      const vehicles = await TaxiVehicle.findAll({ 
        include: [{ model: TaxiDriver, as: 'driver' }],
        order: [['createdAt', 'DESC']]
      });
      res.json({ success: true, data: vehicles });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error fetching taxi vehicles', error: err.message });
    }
  },

  // Get vehicle by ID
  async getById(req, res) {
    try {
      const vehicle = await TaxiVehicle.findByPk(req.params.id, {
        include: [{ model: TaxiDriver, as: 'driver' }]
      });
      if (!vehicle) return res.status(404).json({ success: false, message: 'Taxi vehicle not found' });
      res.json({ success: true, data: vehicle });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error fetching taxi vehicle', error: err.message });
    }
  },

  // Create vehicle
  async create(req, res) {
    try {
      const { driver_id, make, model, plate_number, color, status } = req.body;
      const vehicle = await TaxiVehicle.create({ driver_id, make, model, plate_number, color, status });
      res.status(201).json({ success: true, message: 'Taxi vehicle created successfully', data: vehicle });
    } catch (err) {
      res.status(400).json({ success: false, message: 'Error creating taxi vehicle', error: err.message });
    }
  },

  // Update vehicle
  async update(req, res) {
    try {
      const { driver_id, make, model, plate_number, color, status } = req.body;
      const vehicle = await TaxiVehicle.findByPk(req.params.id);
      if (!vehicle) return res.status(404).json({ success: false, message: 'Taxi vehicle not found' });
      await vehicle.update({ driver_id, make, model, plate_number, color, status });
      res.json({ success: true, message: 'Taxi vehicle updated successfully', data: vehicle });
    } catch (err) {
      res.status(400).json({ success: false, message: 'Error updating taxi vehicle', error: err.message });
    }
  },

  // Delete vehicle
  async delete(req, res) {
    try {
      const vehicle = await TaxiVehicle.findByPk(req.params.id);
      if (!vehicle) return res.status(404).json({ success: false, message: 'Taxi vehicle not found' });
      await vehicle.destroy();
      res.json({ success: true, message: 'Taxi vehicle deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Error deleting taxi vehicle', error: err.message });
    }
  }
}; 