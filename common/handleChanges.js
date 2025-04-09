const { sendToThingsBoard } = require("./commonFunctions");
const { parkingUrl, soundSensorUrl } = require("./thingsBoardUrls");
const { decodeUplink } = require("./decode");
const { Device, Uplink, UplinkMetadata, SensorData } = require("../models");

const handleParkingChange = async (parkingData = null) => {
  try {
    const latestParking = await SensorData.findOne({ order: [["id", "DESC"]] });

    if (!latestParking) {
      console.log("No parking data found.");
      return;
    }

    const {
      available,
      device_id,
      device_name,
      timestamp,
      faulty_sensors,
      reserved,
      occupied,
      total,
    } = latestParking;

    await sendToThingsBoard(parkingUrl, {
      available,
      faultySensors: faulty_sensors,
      reserved,
      occupied,
      deviceName: device_name,
      timeStamp: timestamp,
      deviceId: device_id,
      total,
    });
  } catch (err) {
    console.error("Error handling parking change:", err);
  }
};

const handleSensorData = async (msg) => {
  try {
    const latestUplink = msg;
    const device = await Device.findOne({
      where: { id: latestUplink.WirelessDeviceId },
    });
    const decodedBytes = Buffer.from(latestUplink.raw_payload, "base64");
    const result = decodeUplink({ bytes: [...decodedBytes] });

    let thingsBoardPayload, sensorUrl;
    if (device.device_name === "District Sound Sensor") {
      sensorUrl = soundSensorUrl;
      thingsBoardPayload = {
        battery: result.data.battery,
        LAI: result.data.LAI,
        LAeq: result.data.LAeq,
        LAImax: result.data.LAImax,
      };
    }
    // sending data to things board
    await sendToThingsBoard(sensorUrl, thingsBoardPayload);
  } catch (error) {
    console.log(error);
    throw error;
  }
};

module.exports = { handleParkingChange, handleSensorData };
