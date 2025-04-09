const parkingUrl = `${process.env.THINGSBOARD_URL}/api/v1/${process.env.PARKINGDATA_ACCESS_TOKEN}/telemetry`;
const soundSensorUrl = `${process.env.THINGSBOARD_URL}/api/v1/${process.env.SOUNDSENSOR_ACCESS_TOKEN}/telemetry`;
module.exports = { parkingUrl, soundSensorUrl };
