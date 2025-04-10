const { sendToThingsBoard, sendTriggerMessage } = require("./commonFunctions");
const thingsBoardUrls = require("./thingsBoardUrls");
const { Device, Uplink, UplinkMetadata, SensorData } = require("../models");
const soundSersorDecoder = require("./decoders/WS302Decoder");
const smallPeopleSersorDecoder = require("./decoders/VS351Decoder");

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

const handleSensorData = async (latestUplink) => {
  try {
    const device = await Device.findOne({
      where: { id: latestUplink.device_id },
    });
    let decodedBytes = Buffer.from(latestUplink.raw_payload, "base64");

    let thingsBoardPayload, sensorUrl, result;
    switch (device.device_type) {
      case "Sound":
        result = soundSersorDecoder.decodeUplink({
          bytes: [...decodedBytes],
        });
        sensorUrl = thingsBoardUrls.soundSensorUrl;
        thingsBoardPayload = {
          battery: result.data.battery,
          LAI: result.data.LAI,
          LAeq: result.data.LAeq,
          LAImax: result.data.LAImax,
        };
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        let msg;
        // if (result.data.LAeq >= 140 && result.data.LAeq <= 190)
        if (thingsBoardPayload.LAeq >= 140 && thingsBoardPayload.LAeq <= 190) {
          msg =
            "Alert! Possible gunshot detected. Sound level between 140-190 dB. Immediate attention required in the area.";
          await sendTriggerMessage(msg, "+916304807441");
        }
        if (
          currentHour <= 20 &&
          thingsBoardPayload.LAeq >= 90 &&
          thingsBoardPayload.LAeq <= 120
        ) {
          msg =
            "Notice: Sound level detected between 90-120 dB after 8PM. The music at the District during events may be too loud. Please assess and adjust if necessary.";
          await sendTriggerMessage(msg, "+916304807441");
        }

        break;
      case "Small People":
        result = smallPeopleSersorDecoder.decodeUplink({
          bytes: [...decodedBytes],
        });
        sensorUrl = thingsBoardUrls.smallPeopleSensorUrl;
        thingsBoardPayload = {
          total_in: result.data.total_in,
          total_out: result.data.total_out,
          temperature: result.data.temperature,
          period_in: result.data.period_in,
          period_out: result.data.period_out,
          battery: result.data.battery,
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
