const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const CartItem = sequelize.define('CartItem', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  cart_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  },
  product_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: false
  },
  variation_id: {
    type: DataTypes.BIGINT.UNSIGNED,
    allowNull: true
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    validate: {
      min: 1
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  total_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
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
  tableName: 'cart_items',
  timestamps: true,
  indexes: [
    {
      fields: ['cart_id']
    },
    {
      fields: ['product_id']
    },
    {
      fields: ['variation_id']
    }
  ]
});

module.exports = CartItem; 