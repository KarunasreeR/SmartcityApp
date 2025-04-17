const {
  sendToThingsBoard,
  sendTriggerMessage,
  sendAlertEmail,
} = require("./commonFunctions");
const thingsBoardUrls = require("./thingsBoardUrls");
const { Device, Uplink, UplinkMetadata, SensorData } = require("../models");
const soundSersorDecoder = require("./decoders/WS302Decoder");
const smallPeopleSersorDecoder = require("./decoders/VS351Decoder");
const largePeopleSersorDecoder = require("./decoders/VS350Decoder");

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
          battery: result.data?.battery,
          LAI: result.data?.LAI,
          LAeq: result.data?.LAeq,
          LAImax: result.data?.LAImax,
          // battery: Math.random(1, 90) * 200,
          // LAI: Math.random(1, 90) * 200,
          // LAeq: Math.random(1, 90) * 200,
          // LAImax: Math.random(1, 90) * 200,
          latitude: 33.5775,
          longitude: -84.3395,
        };
        const currentDate = new Date();
        const currentHour = currentDate.getHours();
        let msg;
        // if (result.data.LAeq >= 140 && result.data.LAeq <= 190)
        if (thingsBoardPayload.LAeq >= 140 && thingsBoardPayload.LAeq <= 190) {
          msg =
            "Alert! Possible gunshot detected. Sound level between 140-190 dB. Immediate attention required in the area.";
          // await sendTriggerMessage(msg, "+916304807441");
          await sendAlertEmail(
            "karuna1350@gmail.com",
            "Urgent: Possible Gunshot Detection in Morrow City 🚨",
            "gunshotDetected"
          );
        }
        if (
          currentHour <= 20 &&
          thingsBoardPayload.LAeq >= 90 &&
          thingsBoardPayload.LAeq <= 120
        ) {
          msg =
            "Notice: Sound level detected between 90-120 dB after 8PM. The music at the District during events may be too loud. Please assess and adjust if necessary.";
          // await sendTriggerMessage(msg, "+916304807441");
          await sendAlertEmail(
            "karuna1350@gmail.com",
            "Noise Level Alert: High Sound Detected in Morro City After 8 PM",
            "loudNoiseAtNight"
          );
        }

        break;
      case "Small People":
        result = smallPeopleSersorDecoder.decodeUplink({
          bytes: [...decodedBytes],
        });
        sensorUrl = thingsBoardUrls.smallPeopleSensorUrl;
        thingsBoardPayload = {
          total_in: result.data?.total_in,
          total_out: result.data?.total_out,
          temperature: result.data?.temperature,
          period_in: result.data?.period_in,
          period_out: result.data?.period_out,
          // battery: result.data?.battery,
          // total_in: Math.floor(Math.random() * 90 + 1),
          // total_out: Math.floor(Math.random() * 90 + 1),
          // temperature: Math.floor(Math.random() * 90 + 1),
          // period_in: Math.floor(Math.random() * 90 + 1),
          // period_out: Math.floor(Math.random() * 90 + 1),
          // battery: 99,
          latitude: 33.588,
          longitude: -84.316,
        };
        break;
      case "Large People":
        result = largePeopleSersorDecoder.decodeUplink({
          bytes: [...decodedBytes],
        });
        sensorUrl = thingsBoardUrls.largePeopleSensorUrl;
        thingsBoardPayload = {
          ipso_version: result.data?.ipso_version,
          sn: result.data?.sn,
          hardware_version: result.data?.hardware_version,
          total_in: result.data?.total_in,
          total_out: result.data?.total_out,
          temperature: result.data?.temperature,
          period_in: result.data?.period_in,
          period_out: result.data?.period_out,
          // battery: result.data?.battery,
          // total_in: Math.floor(Math.random() * 90 + 1),
          // total_out: Math.floor(Math.random() * 90 + 1),
          // temperature: Math.floor(Math.random() * 90 + 1),
          // period_in: Math.floor(Math.random() * 90 + 1),
          // period_out: Math.floor(Math.random() * 90 + 1),
          latitude: 33.5885,
          longitude: -84.336,
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
