const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Uplink = require("./uplink");

const UplinkMetadata = sequelize.define(
  "UplinkMetadata",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    uplink_id: {
      type: DataTypes.UUID,
      references: {
        model: Uplink,
        key: "id",
      },
      onDelete: "CASCADE",
    },
    fcnt: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fport: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    rssi: {
      type: DataTypes.INTEGER,
    },
    snr: {
      type: DataTypes.FLOAT,
    },
  },
  {
    tableName: "uplink_metadata",
    timestamps: false,
  }
);

Uplink.hasMany(UplinkMetadata, { foreignKey: "uplink_id" });
UplinkMetadata.belongsTo(Uplink, { foreignKey: "uplink_id" });

module.exports = UplinkMetadata;
