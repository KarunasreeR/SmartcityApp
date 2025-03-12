const fs = require("fs");
const path = require("path");
const sequelize = require("../config/db"); // Import existing sequelize instance
const { Sequelize } = require("sequelize");

// Load models
const models = {};
fs.readdirSync(__dirname)
  .filter((file) => file !== "index.js" && file.endsWith(".js"))
  .forEach((file) => {
    const model = require(path.join(__dirname, file));
    models[model.name] = model;
  });

models.sequelize = sequelize;
models.Sequelize = Sequelize;

module.exports = models;
