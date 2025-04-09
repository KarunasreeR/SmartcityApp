const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Device = require("./device");

const Uplink = sequelize.define(
  "Uplink",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: sequelize.literal("gen_random_uuid()"),
      primaryKey: true,
    },
    device_id: {
      type: DataTypes.UUID,
      references: {
        model: Device,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    received_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    raw_payload: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    decoded_payload: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  },
  {
    tableName: "uplinks",
    timestamps: false,
  }
);

Device.hasMany(Uplink, { foreignKey: "device_id" });
Uplink.belongsTo(Device, { foreignKey: "device_id" });

module.exports = Uplink;
