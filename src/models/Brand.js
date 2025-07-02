const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Brand = sequelize.define('Brand', {
  id: {
    type: DataTypes.BIGINT.UNSIGNED,
    primaryKey: true,
    autoIncrement: true
  },
  brand_name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  photo: {
    type: DataTypes.STRING,
    allowNull: true
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
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
  timestamps: true,
  tableName: 'brands',
  underscored: true
});

// Define associations
Brand.associate = (models) => {
  Brand.hasMany(models.Product, {
    foreignKey: 'brand_id',
    as: 'products'
  });
};

module.exports = Brand; 