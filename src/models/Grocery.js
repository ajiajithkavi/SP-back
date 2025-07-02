const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Grocery = sequelize.define('Grocery', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
  },
  original_price: {
    type: DataTypes.DECIMAL(10, 2),
  },
  discounted_price: {
    type: DataTypes.DECIMAL(10, 2),
  },
  image: {
    type: DataTypes.STRING,
  },
  rating: {
    type: DataTypes.DECIMAL(3, 2),
  },
  is_best_seller: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
  },
  category: {
    type: DataTypes.STRING,
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
  },
  createdAt: {
    type: DataTypes.DATE,
    field: 'created_at',
    allowNull: false
  },
  updatedAt: {
    type: DataTypes.DATE,
    field: 'updated_at',
    allowNull: false
  }
}, {
  tableName: 'groceries',
  timestamps: true,
  underscored: true,
});

module.exports = Grocery;
