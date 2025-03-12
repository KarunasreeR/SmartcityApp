const SensorData = require("../models/sensorData");
const { sendToThingsBoard } = require("./commonFunctions");
const { parkingUrl } = require("./thingsBoardUrls");

const handleParkingChange = async (parkingData = null) => {
  console.log("Handling Parking Change:", parkingData);

  try {
    const latestParking = await SensorData.findOne({ order: [["id", "DESC"]] });

    if (!latestParking) {
      console.log("No parking data found.");
      return;
    }

    const { available, faulty_sensors, reserved, occupied } = latestParking;

    await sendToThingsBoard(parkingUrl, {
      available,
      faulty_sensors,
      reserved,
      occupied,
    });

    console.log("Parking data successfully sent to ThingsBoard.");
  } catch (err) {
    console.error("Error handling parking change:", err);
  }
};

module.exports = { handleParkingChange };
