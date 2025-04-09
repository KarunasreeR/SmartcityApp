const { sendToThingsBoard } = require("./commonFunctions");
const thingsBoardUrls = require("./thingsBoardUrls");
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
      where: { id: latestUplink.device_id },
    });
    const decodedBytes = Buffer.from(latestUplink.raw_payload, "base64");
    const result = decodeUplink({ bytes: [...decodedBytes] });

    let thingsBoardPayload, sensorUrl;
    switch (device.device_type) {
      case "Sound":
        sensorUrl = thingsBoardUrls.soundSensorUrl;
        thingsBoardPayload = {
          battery: result.data.battery,
          LAI: result.data.LAI,
          LAeq: result.data.LAeq,
          LAImax: result.data.LAImax,
        };
        break;
      case "Small People":
        sensorUrl = thingsBoardUrls.smallPeopleSensorUrl;
        thingsBoardPayload = {
          battery: result.data.battery,
          LAI: result.data.LAI,
          LAeq: result.data.LAeq,
          LAImax: result.data.LAImax,
        };
        break;
      case "Large People":
        sensorUrl = thingsBoardUrls.largePeopleSensorUrl;
        thingsBoardPayload = {
          battery: result.data.battery,
          LAI: result.data.LAI,
          LAeq: result.data.LAeq,
          LAImax: result.data.LAImax,
        };
        break;
      case "R718B151":
        sensorUrl = thingsBoardUrls.temperatureSensorUrl;
        thingsBoardPayload = {
          battery: result.data.battery,
          LAI: result.data.LAI,
          LAeq: result.data.LAeq,
          LAImax: result.data.LAImax,
        };
        break;
      case "R719A":
        sensorUrl = thingsBoardUrls.SurfaceMountedParkingsensorUrl;
        thingsBoardPayload = {
          battery: result.data.battery,
          LAI: result.data.LAI,
          LAeq: result.data.LAeq,
          LAImax: result.data.LAImax,
        };
        break;
      case "R718LB":
        sensorUrl = thingsBoardUrls.HallEffectSensorUrl;
        thingsBoardPayload = {
          battery: result.data.battery,
          LAI: result.data.LAI,
          LAeq: result.data.LAeq,
          LAImax: result.data.LAImax,
        };
        break;
      case "R712":
        sensorUrl = thingsBoardUrls.temperatureAndHumididtySensorUrl;
        thingsBoardPayload = {
          battery: result.data.battery,
          LAI: result.data.LAI,
          LAeq: result.data.LAeq,
          LAImax: result.data.LAImax,
        };
        break;
      default:
        console.error("Unknown device type:", device.device_type);
        break;
    }

    // sending data to things board
    await sendToThingsBoard(sensorUrl, thingsBoardPayload);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { handleParkingChange, handleSensorData };
