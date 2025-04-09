"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION notify_uplink_changes() RETURNS TRIGGER AS $$
      BEGIN
        PERFORM pg_notify('uplink_changes', row_to_json(NEW)::text);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS uplink_changes_trigger ON "uplinks";
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER uplink_changes_trigger
      AFTER INSERT OR UPDATE ON "uplinks"
      FOR EACH ROW
      EXECUTE FUNCTION notify_uplink_changes();
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS uplink_changes_trigger ON "uplinks";
    `);

    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS notify_uplink_changes();
    `);
  },
};
