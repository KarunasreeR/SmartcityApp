const parkingUrl = `${process.env.THINGSBOARD_URL}/api/v1/${process.env.PARKINGDATA_ACCESS_TOKEN}/telemetry`;
const soundSensorUrl = `${process.env.THINGSBOARD_URL}/api/v1/${process.env.SOUNDSENSOR_ACCESS_TOKEN}/telemetry`;
const smallPeopleSensorUrl = `${process.env.THINGSBOARD_URL}/api/v1/${process.env.SMALL_PEOPLE_SENSOR_ACCESS_TOKEN}/telemetry`;
const largePeopleSensorUrl = `${process.env.THINGSBOARD_URL}/api/v1/${process.env.LARGE_PEOPLE_SENSOR_ACCESS_TOKEN}/telemetry`;
const temperatureSensorUrl = `${process.env.THINGSBOARD_URL}/api/v1/${process.env.TEMPERATURE_SENSOR_ACCESS_TOKEN}/telemetry`;
const SurfaceMountedParkingsensorUrl = `${process.env.THINGSBOARD_URL}/api/v1/${process.env.SURFACE_MOUNTED_PARKING_SENSOR_ACCESS_TOKEN}/telemetry`;
const HallEffectSensorUrl = `${process.env.THINGSBOARD_URL}/api/v1/${process.env.HALL_EFFECT_SENSOR_ACCESS_TOKEN}/telemetry`;
const temperatureAndHumididtySensorUrl = `${process.env.THINGSBOARD_URL}/api/v1/${process.env.TEMPERATURE_AND_HUMIDITY_SENSOR_ACCESS_TOKEN}/telemetry`;
module.exports = {
  parkingUrl,
  soundSensorUrl,
  smallPeopleSensorUrl,
  largePeopleSensorUrl,
  temperatureSensorUrl,
  SurfaceMountedParkingsensorUrl,
  HallEffectSensorUrl,
  temperatureAndHumididtySensorUrl,
};
