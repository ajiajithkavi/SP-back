'use strict';

module.exports = (sequelize, DataTypes) => {
  const Gwhishlist = sequelize.define('gwhishlist', {
    id: {
      type: DataTypes.BIGINT.UNSIGNED,
      autoIncrement: true,
      primaryKey: true
    },
    user_id: DataTypes.BIGINT.UNSIGNED,
    grocery_id: DataTypes.BIGINT.UNSIGNED,
    name: DataTypes.STRING,
    image: DataTypes.STRING,
    category: DataTypes.STRING,
    original_price: DataTypes.DECIMAL(10, 2),
    discounted_price: DataTypes.DECIMAL(10, 2),
    quantity: {
      type: DataTypes.INTEGER,
      defaultValue: 1
    }
  }, {
    tableName: 'gwhishlist',
    timestamps: true,       // ✅ Sequelize will auto-manage createdAt/updatedAt
    underscored: true       // ✅ Maps to `created_at`, `updated_at` in MySQL
  });

  return Gwhishlist;
};
