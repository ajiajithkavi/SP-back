'use strict';
const {
  Model
} = require('sequelize');
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

module.exports = (sequelize, DataTypes) => {
  class TaxiRide extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      TaxiRide.belongsTo(models.TaxiDriver, { foreignKey: 'driver_id', as: 'driver' });
      TaxiRide.belongsTo(models.TaxiVehicle, { foreignKey: 'vehicle_id', as: 'vehicle' });
      TaxiRide.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    }
  }

  TaxiRide.init({
    id: {
      type: DataTypes.BIGINT,
      primaryKey: true,
      autoIncrement: true
    },
    user_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    driver_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'taxi_drivers',
        key: 'id'
      }
    },
    vehicle_id: {
      type: DataTypes.BIGINT,
      allowNull: false,
      references: {
        model: 'taxi_vehicles',
        key: 'id'
      }
    },
    pickup_location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    dropoff_location: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fare: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    status: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    requested_at: {
      type: DataTypes.DATE,
      allowNull: false
    },
    started_at: {
      type: DataTypes.DATE,
      allowNull: true
    },
    completed_at: {
      type: DataTypes.DATE,
      allowNull: true
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
    modelName: 'TaxiRide',
    tableName: 'taxi_rides',
    underscored: true,
    timestamps: true
  });

  return TaxiRide;
};