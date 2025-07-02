const Unit = require('../models/Unit');

// Get all units
exports.getAllUnits = async (req, res) => {
  try {
    const units = await Unit.findAll({
      order: [['createdAt', 'DESC']]
    });
    res.json(units);
  } catch (error) {
    console.error('Error fetching units:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching units',
      error: error.message
    });
  }
};

// Get unit by ID
exports.getUnitById = async (req, res) => {
  try {
    const unit = await Unit.findByPk(req.params.id);
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found'
      });
    }
    res.json(unit);
  } catch (error) {
    console.error('Error fetching unit:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching unit',
      error: error.message
    });
  }
};

// Create unit
exports.createUnit = async (req, res) => {
  try {
    const { unit_name, unit_symbol } = req.body;

    const unit = await Unit.create({
      unit_name,
      unit_symbol
    });

    res.status(201).json({
      success: true,
      message: 'Unit created successfully',
      data: unit
    });
  } catch (error) {
    console.error('Error creating unit:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating unit',
      error: error.message
    });
  }
};

// Update unit
exports.updateUnit = async (req, res) => {
  try {
    const unit = await Unit.findByPk(req.params.id);
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found'
      });
    }

    const { unit_name, unit_symbol } = req.body;

    await unit.update({
      unit_name: unit_name || unit.unit_name,
      unit_symbol: unit_symbol || unit.unit_symbol
    });

    res.json({
      success: true,
      message: 'Unit updated successfully',
      data: unit
    });
  } catch (error) {
    console.error('Error updating unit:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating unit',
      error: error.message
    });
  }
};

// Delete unit
exports.deleteUnit = async (req, res) => {
  try {
    const unit = await Unit.findByPk(req.params.id);
    if (!unit) {
      return res.status(404).json({
        success: false,
        message: 'Unit not found'
      });
    }

    await unit.destroy();

    res.json({
      success: true,
      message: 'Unit deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting unit:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting unit',
      error: error.message
    });
  }
};

// Bulk delete units
exports.bulkDeleteUnits = async (req, res) => {
  try {
    const { ids } = req.body;
    if (!ids || !Array.isArray(ids)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide an array of unit IDs'
      });
    }

    await Unit.destroy({
      where: {
        id: ids
      }
    });

    res.json({
      success: true,
      message: 'Units deleted successfully'
    });
  } catch (error) {
    console.error('Error bulk deleting units:', error);
    res.status(500).json({
      success: false,
      message: 'Error bulk deleting units',
      error: error.message
    });
  }
}; 