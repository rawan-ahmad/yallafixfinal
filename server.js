/**
 * server.js
 *
 * 1. Generates a 6-digit OTP and sends it to the user via WhatsApp using Twilio.
 * 2. Verifies the OTP when the user enters it.
 * 
 * Requirements:
 *   npm init -y
 *   npm install express body-parser twilio
 *
 * Usage:
 *   node server.js
 *   (Then open http://localhost:3000/signup.html in your browser)
 */

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const twilio = require('twilio');

const app = express();
app.use(bodyParser.json());

// Serve static files (including signup.html) from the current directory
app.use(express.static(__dirname));

// ------------------ Twilio Credentials ------------------
const accountSid = 'AC7dc2209a70b37d7e2b3deea581e7e98a';
const authToken = '75367a0982eb140bcacbc85611a6e847';
const client = twilio(accountSid, authToken);

// This is your Twilio WhatsApp sandbox number or an approved WhatsApp number
// Example for sandbox: 'whatsapp:+14155238886'
const WHATSAPP_FROM = 'whatsapp:+96181106116';

// In-memory OTP store (for demo). For production, use a real database or cache.
const otpStore = {};

// ------------------ Routes ------------------

// 1. Send OTP via WhatsApp
app.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body; // Should be in E.164 format, e.g. +1234567890

  if (!phoneNumber) {
    return res.status(400).json({
      success: false,
      message: 'No phone number provided'
    });
  }

  // Generate a 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Store it (in memory) keyed by phoneNumber
  otpStore[phoneNumber] = otp;

  try {
    // Send WhatsApp message via Twilio
    await client.messages.create({
      body: `Your YallaFix verification code is: ${otp}`,
      from: WHATSAPP_FROM,        // e.g. 'whatsapp:+14155238886'
      to: `whatsapp:${phoneNumber}`
    });

    return res.json({
      success: true,
      message: 'OTP sent via WhatsApp!'
    });
  } catch (error) {
    console.error('Error sending WhatsApp OTP:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send OTP'
    });
  }
});

// 2. Verify OTP
app.post('/verify-otp', (req, res) => {
  const { phoneNumber, userOtp } = req.body;

  if (!phoneNumber || !userOtp) {
    return res.status(400).json({
      success: false,
      message: 'Missing phoneNumber or OTP'
    });
  }

  const storedOtp = otpStore[phoneNumber];
  if (storedOtp && storedOtp === userOtp) {
    // OTP matches
    // (Mark user as verified in your real database here)
    return res.json({
      success: true,
      message: 'OTP verified successfully!'
    });
  } else {
    // OTP mismatch
    return res.status(400).json({
      success: false,
      message: 'Invalid OTP'
    });
  }
});

// Start the server on port 3000
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
