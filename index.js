const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const CONTACT_EMAIL = functions.config().env.vite_contact_email;
const EMAIL_PASSWORD = functions.config().env.vite_contact_pssw;

const app = express();
app.use(cors({origin: true}));
app.use(bodyParser.json());
// app.use(cors());

// app.get('/get', (req, res) => {
//   res.send('Hello World!');
// });

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

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
      res.status(500).send("Internal Server Error");
    } else {
      console.log("Email sent: " + info.response);
      res.status(200).send("Email sent successfully");
    }
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
