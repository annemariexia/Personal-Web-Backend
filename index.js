const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const rateLimit = require("express-rate-limit");

dotenv.config();

const CONTACT_EMAIL = functions.config().env.vite_contact_email;
const EMAIL_PASSWORD = functions.config().env.vite_contact_pssw;

const app = express();
app.use(cors({origin: true}));
app.use(bodyParser.json());


const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 3, // Limit each IP to 3 requests per windowMs
  message: "Too many requests, please try again later."
});

// Apply the rate limiter to all requests
app.use(limiter);



app.post("/send-email", (req, res) => {
  const {name, email, message} = req.body; // Configure Nodemailer transporter
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: CONTACT_EMAIL,
      pass: EMAIL_PASSWORD,
    },
  });

  // Email content
  const mailOptions = {
    from: CONTACT_EMAIL,
    to: CONTACT_EMAIL,
    subject: "New Contact from Annemarie's Site",
    text: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
  };


  const sendEmail = (mailOptions) => {
    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.error(error);
          reject(error); // Reject the promise with the error
        } else {
          console.log("Email sent: " + info.response);
          resolve(info); // Resolve the promise with the information
        }
      });
    });
  };

  sendEmail(mailOptions)
      .then((info) => {
        res.status(200).send("Email sent successfully");
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        res.status(500).send("Internal Server Error");
      });
});

exports.api = functions.https.onRequest((request, response) => {
  // Set CORS headers
  response.setHeader("Access-Control-Allow-Origin", "*");
  response.setHeader("Access-Control-Allow-Methods", "POST");
  response.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Forward request to Express app
  return app(request, response);
});
