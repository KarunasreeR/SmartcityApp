const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const SensorData = sequelize.define(
  "SensorData",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    device_id: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    device_name: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    occupied: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    reserved: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    available: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    faulty_sensors: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    total: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "sensor_data",
    timestamps: false,
  }
);

module.exports = SensorData;
