const axios = require("axios");

const sendToThingsBoard = async (url, data) => {
  try {
    await axios.post(url, data);

    console.log("Data sent to ThingsBoard:", data);
  } catch (error) {
    console.error("Error sending data to ThingsBoard:", error.message);
  }
};

const sendTriggerMessage = async (msg, recepientPhoneNumber) => {
  const twilio = require("twilio");
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

  const client = new twilio(accountSid, authToken);

  client.messages
    .create({
      body: msg, // Message content
      to: recepientPhoneNumber, // Recipient phone number
      from: twilioPhoneNumber, // Your Twilio phone number
    })
    .then((message) => console.log("Alert Message sent: " + message.sid))
    .catch((error) => console.log("Error sending SMS: " + error));
};

module.exports = { sendToThingsBoard, sendTriggerMessage };
