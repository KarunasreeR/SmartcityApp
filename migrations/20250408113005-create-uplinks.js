'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('uplinks', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      device_id: {
        type: Sequelize.UUID,
        references: {
          model: 'devices',
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      received_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      raw_payload: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      decoded_payload: {
        type: Sequelize.JSONB,
        allowNull: false
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('uplinks');
  }
};
