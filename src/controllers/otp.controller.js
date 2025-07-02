const OTP = require('../models/otp.model');
const { Op } = require('sequelize');

// Generate a random 4-digit OTP
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

// Generate and save OTP
exports.generateOTP = async (req, res) => {
    try {
        const { email } = req.body;

        // Generate new OTP
        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // OTP valid for 10 minutes

        // Save OTP to database
        await OTP.create({
            email,
            otp,
            expiresAt
        });

        // In a production environment, you would send this OTP via email/SMS
        // For development, we'll just return it
        res.json({
            success: true,
            message: 'OTP generated successfully',
            otp // Remove this in production
        });
    } catch (error) {
        console.error('Error generating OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Error generating OTP'
        });
    }
};

// Verify OTP
exports.verifyOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // Find the most recent valid OTP for the email
        const otpRecord = await OTP.findOne({
            where: {
                email,
                otp,
                expiresAt: {
                    [Op.gt]: new Date()
                },
                isUsed: false
            },
            order: [['createdAt', 'DESC']]
        });

        if (!otpRecord) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired OTP'
            });
        }

        // Mark OTP as used
        await otpRecord.update({ isUsed: true });

        res.json({
            success: true,
            message: 'OTP verified successfully'
        });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({
            success: false,
            message: 'Error verifying OTP'
        });
    }
}; 