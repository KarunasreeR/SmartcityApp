const express = require("express");
const router = express.Router();
const sensorData = require("../models/sensorData");

// Add Parking Data
router.post("/parking", async (req, res) => {
  try {
    // Generate random values
    const available = Math.floor(Math.random() * 100);
    const occupied = Math.floor(Math.random() * (100 - available));
    const reserved = Math.floor(Math.random() * (100 - available - occupied));
    const faulty_sensors = 100 - (available + occupied + reserved);
    const total = available + occupied + reserved + faulty_sensors;
    const timestamp = new Date(); // Current timestamp
    const device_name = "parking-sensor";

    // Create new parking entry
    const newParking = await sensorData.create({
      device_name,
      occupied,
      reserved,
      available,
      faulty_sensors,
      total,
      timestamp,
    });

    res.json({ message: "Parking data added", data: newParking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get Latest Parking Data
router.get("/parking", async (req, res) => {
  try {
    const latestParking = await sensorData.findOne({ order: [["id", "DESC"]] });
    if (!latestParking)
      return res.status(404).json({ message: "No data found" });

    res.json({ message: "Latest Parking Data", data: latestParking });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
