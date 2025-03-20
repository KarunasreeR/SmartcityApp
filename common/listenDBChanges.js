const { Client } = require("pg");
const { handleParkingChange } = require("./handleChanges");
require("dotenv").config();

const listenToDb = async () => {
  const client = new Client({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: { require: true, rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log("Listening for PostgreSQL changes...");

    // Initial update to thingsboard when server started
    await handleParkingChange();

    client.query("LISTEN parking_changes");

    client.on("notification", async (msg) => {
      await handleParkingChange(JSON.parse(msg.payload));
    });
  } catch (err) {
    console.error("Connection error:", err);
  }
};

module.exports = { listenToDb };
