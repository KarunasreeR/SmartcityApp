require("dotenv").config();
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const { sequelize } = require("./models");
const sensorRouter = require("./routes/sensor");
const indexRouter = require("./routes/index");
const { listenToDb } = require("./common/listenDBChanges");

const app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/sensor", sensorRouter);
app.use("/", indexRouter);

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

module.exports = app;
