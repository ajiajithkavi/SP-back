const express = require('express');
const router = express.Router();
const otpController = require('../controllers/otp.controller');

// Generate OTP
router.post('/generate', otpController.generateOTP);

// Verify OTP
router.post('/verify', otpController.verifyOTP);

module.exports = router; 