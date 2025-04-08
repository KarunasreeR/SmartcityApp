require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { sequelize } = require("./models");
const sensorRouter = require("./routes/sensor");
const indexRouter = require("./routes/index");
const { listenToDb } = require("./common/listenDBChanges");
const {handleSensorData} =  require("./common/handleSensorData");

const app = express();
const cors = require("cors");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/sensor", sensorRouter);
app.use("/", indexRouter);


// Sample live data (Mock sensor readings)
app.get("/sensor/parking/live", (req, res) => {
  const liveData = {
      timestamp: new Date(),
      parkingSlot1: Math.random() > 0.5 ? "Occupied" : "Available",
      parkingSlot2: Math.random() > 0.5 ? "Occupied" : "Available",
      parkingSlot3: Math.random() > 0.5 ? "Occupied" : "Available"
  };
  res.json(liveData);
});

// Sync Database & Start Listening to DB Changes
(async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Connected to PostgreSQL");
    listenToDb();
  } catch (err) {
    console.error("❌ PostgreSQL Connection Error:", err);
  }
})();

// 
(async () => {
  try {
    await handleSensorData()
  } catch (err) {
    console.error("Error: ", err);
  }
})();

module.exports = app;
