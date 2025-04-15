const axios = require("axios");
const AWS = require("aws-sdk");
const twilio = require("twilio");
const fs = require("fs");
const path = require("path");

const sendToThingsBoard = async (url, data) => {
  try {
    await axios.post(url, data);

    console.log("Data sent to ThingsBoard:", data);
  } catch (error) {
    console.error("Error sending data to ThingsBoard:", error.message);
  }
};

AWS.config.update({ region: "us-east-1" });

const sendTriggerMessage = async (msg, recepientPhoneNumber) => {
  const sns = new AWS.SNS();
  const params = {
    Message: msg,
    PhoneNumber: recepientPhoneNumber,
  };

  sns.publish(params, (err, data) => {
    if (err) {
      console.error("Error sending SMS:", err);
    } else {
      console.log("SMS sent successfully:", data);
    }
  });
};

// Function to get the email template based on notification type
const getEmailTemplate = (recipientName, senderName, notificationType) => {
  let template = "";

  if (notificationType === "loudNoiseAtNight") {
    template = fs.readFileSync(
      path.join(
        __dirname,
        "./emailTemplates/DetectedLoudNoiseAfter8PMTemplate.html"
      ),
      "utf8"
    );
  } else if (notificationType === "gunshotDetected") {
    template = fs.readFileSync(
      path.join(
        __dirname,
        "./emailTemplates/GunshotDetectionAlertTemplate.html"
      ),
      "utf8"
    );
  } else {
    throw new Error("Invalid notification type");
  }

  template = template.replace("{{recipientName}}", recipientName);
  template = template.replace("{{senderName}}", senderName);

  return template;
};

const sendAlertEmail = async (to, subject, notificationType) => {
  const ses = new AWS.SES({ apiVersion: "2010-12-01" });
  const htmlBody = getEmailTemplate(
    "Morro City Official Team",
    "Morro City Sound Monitoring Team",
    notificationType
  );
  const params = {
    Source: "karuna.r@veltris.com",
    Destination: {
      ToAddresses: [to],
    },
    Message: {
      Subject: { Data: subject },
      Body: {
        Html: { Data: htmlBody },
      },
    },
  };

  try {
    const result = await ses.sendEmail(params).promise();
    console.log("Email sent:", result);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendToThingsBoard, sendTriggerMessage, sendAlertEmail };
