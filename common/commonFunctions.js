const axios = require("axios");

const sendToThingsBoard = async (url, data) => {
  try {
    await axios.post(url, data);

    console.log("Data sent to ThingsBoard:", data);
  } catch (error) {
    console.error("Error sending data to ThingsBoard:", error.message);
  }
};

module.exports = { sendToThingsBoard };
