/**
 * Payload Decoder for Node.js
 *
 * Copyright 2024 Milesight IoT
 *
 * @product WS302
 */

function decodeUplink(input) {
  return { data: milesightDeviceDecode(input.bytes) };
}

function decode(fPort, bytes) {
  return milesightDeviceDecode(bytes);
}

function milesightDeviceDecode(bytes) {
  console.log(bytes);
  let decoded = {};
  let i = 0;

  while (i < bytes.length) {
    let channel_id = bytes[i++];
    let channel_type = bytes[i++];

    // BATTERY
    if (channel_id === 0x01 && channel_type === 0x75) {
      decoded.battery = bytes[i];
      i += 1;
    }
    // SOUND
    else if (channel_id === 0x05 && channel_type === 0x5b) {
      let weight = bytes[i];
      let freq_weight = readFrequencyWeightType(weight & 0x03);
      let time_weight = readTimeWeightType((weight >> 2) & 0x03);

      let sound_level_name = `L${freq_weight}${time_weight}`;
      let sound_level_eq_name = `L${freq_weight}eq`;
      let sound_level_max_name = `L${freq_weight}${time_weight}max`;

      decoded[sound_level_name] = readUInt16LE(bytes.slice(i + 1, i + 3)) / 10;
      decoded[sound_level_eq_name] =
        readUInt16LE(bytes.slice(i + 3, i + 5)) / 10;
      decoded[sound_level_max_name] =
        readUInt16LE(bytes.slice(i + 5, i + 7)) / 10;
      i += 7;
    }
    // LoRaWAN Class Type
    else if (channel_id === 0xff && channel_type === 0x0f) {
      decoded.lorawan_class = readLoRaWANClass(bytes[i]);
      i += 1;
    } else {
      break;
    }
  }

  return decoded;
}

function readFrequencyWeightType(type) {
  return ["Z", "A", "C"][type] || "Unknown";
}

function readTimeWeightType(type) {
  return ["I", "F", "S"][type] || "Unknown";
}

function readUInt16LE(bytes) {
  return (bytes[1] << 8) + bytes[0];
}

function readInt16LE(bytes) {
  let ref = readUInt16LE(bytes);
  return ref > 0x7fff ? ref - 0x10000 : ref;
}

function readLoRaWANClass(type) {
  return ["ClassA", "ClassB", "ClassC", "ClassCtoB"][type] || "Unknown";
}

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

// Convert Base64 PayloadData to bytes array
const decodedBytes = Buffer.from(input.PayloadData, "base64");
console.log(decodedBytes);
// Call the decode function
const result = decodeUplink({ bytes: [...decodedBytes] });

console.log(result);

module.exports = { decodeUplink, decode, milesightDeviceDecode };
