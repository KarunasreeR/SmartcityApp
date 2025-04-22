const parkingUrl = `${process.env.THINGSBOARD_URL}/api/v1/${process.env.PARKINGDATA_ACCESS_TOKEN}/telemetry`;
const soundSensorUrl = `${process.env.THINGSBOARD_URL}/api/v1/${process.env.SOUNDSENSOR_ACCESS_TOKEN}/telemetry`;
const smallPeopleSensorUrl = `${process.env.THINGSBOARD_URL}/api/v1/${process.env.SMALL_PEOPLE_SENSOR_ACCESS_TOKEN}/telemetry`;
const largePeopleSensorUrl = `${process.env.THINGSBOARD_URL}/api/v1/${process.env.LARGE_PEOPLE_SENSOR_ACCESS_TOKEN}/telemetry`;
const waterLevelSensorUrl = `${process.env.THINGSBOARD_URL}/api/v1/${process.env.WATER_LEVEL_SENSOR_ACCESS_TOKEN}/telemetry`;
const submersibleLevelsensorUrl = `${process.env.THINGSBOARD_URL}/api/v1/${process.env.SUBMERSIBLE_SENSOR_ACCESS_TOKEN}/telemetry`;
const ultrasonicSensorUrl = `${process.env.THINGSBOARD_URL}/api/v1/${process.env.ULTRASONIC_SENSOR_ACCESS_TOKEN}/telemetry`;
const pressureTransmitterSensorUrl = `${process.env.THINGSBOARD_URL}/api/v1/${process.env.PRESSURE_TRANSMITTER_SENSOR_ACCESS_TOKEN}/telemetry`;
const enodebUrl = `${process.env.THINGSBOARD_URL}/api/v1/${process.env.ENODEB_ACCESS_TOKEN}/telemetry`;
const cpeUrl = `${process.env.THINGSBOARD_URL}/api/v1/${process.env.CPE_ACCESS_TOKEN}/telemetry`;
module.exports = {
  parkingUrl,
  soundSensorUrl,
  smallPeopleSensorUrl,
  largePeopleSensorUrl,
  waterLevelSensorUrl,
  submersibleLevelsensorUrl,
  ultrasonicSensorUrl,
  pressureTransmitterSensorUrl,
  enodebUrl,
  cpeUrl,
};
