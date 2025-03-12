"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      CREATE OR REPLACE FUNCTION notify_parking_changes() RETURNS TRIGGER AS $$
      BEGIN
        PERFORM pg_notify('parking_changes', row_to_json(NEW)::text);
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;
    `);

    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS parking_changes_trigger ON "sensor_data";
    `);

    await queryInterface.sequelize.query(`
      CREATE TRIGGER parking_changes_trigger
      AFTER INSERT OR UPDATE ON "sensor_data"
      FOR EACH ROW
      EXECUTE FUNCTION notify_parking_changes();
    `);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query(`
      DROP TRIGGER IF EXISTS parking_changes_trigger ON "sensor_data";
    `);

    await queryInterface.sequelize.query(`
      DROP FUNCTION IF EXISTS notify_parking_changes();
    `);
  },
};
