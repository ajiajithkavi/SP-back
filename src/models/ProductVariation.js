const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Product = require('./Product');
const Size = require('./Size');
const Color = require('./Color');
const Unit = require('./Unit');

const ProductVariation = sequelize.define('ProductVariation', {
  product_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'products',
      key: 'id'
    }
  },
  size_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'sizes',
      key: 'id'
    }
  },
  color_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'colors',
      key: 'id'
    }
  },
  unit_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'units',
      key: 'id'
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0
  },
  sku: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  timestamps: true,
  tableName: 'product_variations'
});

// Define associations
ProductVariation.belongsTo(Product, { foreignKey: 'product_id', as: 'product' });
ProductVariation.belongsTo(Size, { foreignKey: 'size_id', as: 'size' });
ProductVariation.belongsTo(Color, { foreignKey: 'color_id', as: 'color' });
ProductVariation.belongsTo(Unit, { foreignKey: 'unit_id', as: 'unit' });

module.exports = ProductVariation; 