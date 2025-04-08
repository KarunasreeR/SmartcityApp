'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('uplink_metadata', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      uplink_id: {
        type: Sequelize.UUID,
        references: {
          model: 'uplinks',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      fcnt: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      fport: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      rssi: {
        type: Sequelize.INTEGER
      },
      snr: {
        type: Sequelize.FLOAT
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('uplink_metadata');
  }
};
