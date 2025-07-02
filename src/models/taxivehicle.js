'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TaxiVehicle extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TaxiVehicle.belongsTo(models.TaxiDriver, { foreignKey: 'driver_id', as: 'driver' });
      TaxiVehicle.hasMany(models.TaxiRide, { foreignKey: 'vehicle_id', as: 'rides' });
    }
  }
  TaxiVehicle.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    driver_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'taxi_drivers',
        key: 'id'
      }
    },
    make: {
      type: DataTypes.STRING,
      allowNull: false
    },
    model: {
      type: DataTypes.STRING,
      allowNull: false
    },
    plate_number: {
      type: DataTypes.STRING,
      allowNull: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
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
    sequelize,
    modelName: 'TaxiVehicle',
    tableName: 'taxi_vehicles',
    underscored: true,
    timestamps: true
  });
  return TaxiVehicle;
};