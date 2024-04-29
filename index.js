/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// import express from "express";
// import bodyParser from "body-parser";
// import cors from "cors";
// import nodemailer from "nodemailer";
// import functions from "firebase-functions";
// import dotenv from "dotenv";

dotenv.config();

// const CONTACT_EMAIL = process.env.VITE_CONTACT_EMAIL;
// const EMAIL_PASSWORD = process.env.VITE_CONTACT_PSSW;

const CONTACT_EMAIL = functions.config().env.vite_contact_email;
const EMAIL_PASSWORD = functions.config().env.vite_contact_pssw;


const app = express();

app.use(bodyParser.json());
app.use(cors());

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

exports.api = functions.https.onRequest(app);
