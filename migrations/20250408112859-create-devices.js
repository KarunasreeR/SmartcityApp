'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('devices', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false
      },
      device_name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      device_model: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      device_type: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      dev_eui: {
        type: Sequelize.STRING(32),
      },
      app_eui: {
        type: Sequelize.STRING(32),
      },
      frequency_plan: {
        type: Sequelize.STRING(20)
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('devices');
  }
};
