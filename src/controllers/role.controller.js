const Role = require('../models/Role');

// Get all roles
exports.getAllRoles = async (req, res) => {
  try {
    const roles = await Role.findAll({
      order: [['createdAt', 'DESC']]
    });

    res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    console.error('Error fetching roles:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching roles',
      error: error.message
    });
  }
};

// Get role by ID
exports.getRoleById = async (req, res) => {
  try {
    const role = await Role.findByPk(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    res.json({
      success: true,
      data: role
    });
  } catch (error) {
    console.error('Error fetching role:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching role',
      error: error.message
    });
  }
};

// Create new role
exports.createRole = async (req, res) => {
  try {
    const { name, description, status } = req.body;

    // Check if role exists
    const roleExists = await Role.findOne({ where: { name } });
    if (roleExists) {
      return res.status(400).json({
        success: false,
        message: 'Role with this name already exists'
      });
    }

    // Create role
    const role = await Role.create({
      name,
      description,
      status: status === 'true' || status === true
    });

    res.status(201).json({
      success: true,
      message: 'Role created successfully',
      data: role
    });
  } catch (error) {
    console.error('Error creating role:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error creating role',
      error: error.message
    });
  }
};

// Update role
exports.updateRole = async (req, res) => {
  try {
    const { name, description, status } = req.body;
    const roleId = req.params.id;

    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Check if name is being changed and if it already exists
    if (name && name !== role.name) {
      const nameExists = await Role.findOne({ where: { name } });
      if (nameExists) {
        return res.status(400).json({
          success: false,
          message: 'Role name already exists'
        });
      }
    }

    // Update role
    await role.update({
      name: name || role.name,
      description: description || role.description,
      status: status === 'true' || status === true
    });

    res.json({
      success: true,
      message: 'Role updated successfully',
      data: role
    });
  } catch (error) {
    console.error('Error updating role:', error);
    if (error.name === 'SequelizeValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: error.errors.map(e => e.message)
      });
    }
    res.status(500).json({
      success: false,
      message: 'Error updating role',
      error: error.message
    });
  }
};

// Delete role
exports.deleteRole = async (req, res) => {
  try {
    const roleId = req.params.id;

    const role = await Role.findByPk(roleId);
    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Role not found'
      });
    }

    // Don't allow deletion of system roles
    if (['admin', 'user'].includes(role.name)) {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete system roles'
      });
    }

    await role.destroy();

    res.json({
      success: true,
      message: 'Role deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting role:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting role',
      error: error.message
    });
  }
}; 