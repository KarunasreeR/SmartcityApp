const {decodeUplink} = require('./decode')
const { sendToThingsBoard } = require("./commonFunctions");
const { sequelize, Device, Uplink, UplinkMetadata } = require("../models");

const handleSensorData = async () => {
  try {
    const input = {
      MessageId: "a10376a7-a9b5-4126-b60f-8db73fbd6643",
      WirelessDeviceId: "1e4b7984-d7d0-4ff5-8790-32a4c8bb35a3",
      PayloadData: "AXVjBVsBjQIZApIC",
      WirelessMetadata: {
        LoRaWAN: {
          FCnt: 114,
          FPort: 85,
        },
      },
    };
     
    // const input = {
    //   MessageId: "c915a4ad-943e-44f3-9d7e-2f1016916b0f",
    //   WirelessDeviceId: "0110c148-209d-45e8-a807-f0a34cb36edd",
    //   PayloadData: "BMwXAfYAA2fEAAXMAAAAAAF1Yw==",
    //   WirelessMetadata: {
    //     LoRaWAN: {
    //       FCnt: 90,
    //       FPort: 85,
    //     },
    //   },
    // };
     
    // const input = {
    //   MessageId: "68e47864-0fef-48ae-96e6-b09cf01e0d06",
    //   WirelessDeviceId: "0110c148-209d-45e8-a807-f0a34cb36edd",
    //   PayloadData: "BMwXAfYAA2fHAAXMAAAAAAF1Yw==",
    //   WirelessMetadata: {
    //     LoRaWAN: {
    //       FCnt: 117,
    //       FPort: 85,
    //     },
    //   },
    // };
     
    // Convert Base64 PayloadData to bytes array
    const decodedBytes = Buffer.from(input.PayloadData, "base64");
    console.log(decodedBytes);
    // Call the decode function
    const result = decodeUplink({ bytes: [...decodedBytes] });
    console.log(result);

    // store result in tables

    const deviceId = input.WirelessDeviceId;

    // Ensure device exists
    await Device.findOrCreate({
      where: { id: deviceId },
      defaults: {
        id: deviceId,
      },
    });

    // Create uplink
    const uplink = await Uplink.create({
      id: input.MessageId,
      device_id: deviceId,
      raw_payload: input.PayloadData,
      decoded_payload: result.data,
    });

    // Create uplink metadata
    await UplinkMetadata.create({
      uplink_id: uplink.id,
      fcnt: input.WirelessMetadata.LoRaWAN.FCnt,
      fport: input.WirelessMetadata.LoRaWAN.FPort,
    });

    // sending data to things board
    const soundSensorUrl = "http://thingsboard.cloud/api/v1/ki3MRBHKZXCHlhlUFbOc/telemetry"
    
    await sendToThingsBoard(soundSensorUrl, {
      battery: result.data.battery,
      LAI: result.data.LAI,
      LAeq: result.data.LAeq,
      LAImax: result.data.LAImax
    });
          
  } catch (error) {
    console.log(error)
    throw error
  }
}

module.exports = {handleSensorData}