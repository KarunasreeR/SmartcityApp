const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Device = sequelize.define(
  "Device",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    device_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    device_model: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    device_type: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    dev_eui: {
      type: DataTypes.STRING(32),
    },
    app_eui: {
      type: DataTypes.STRING(32),
    },
    frequency_plan: {
      type: DataTypes.STRING(20),
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "devices",
    timestamps: false,
  }
);

module.exports = Device;
