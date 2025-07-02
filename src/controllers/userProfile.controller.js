const { UserProfile, User } = require('../models');
const { processImage } = require('../utils/imageProcessor');
const path = require('path');
const fs = require('fs');

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      where: { user_id: req.user.id },
      include: [{
        model: User,
        attributes: ['name', 'email', 'phone', 'role']
      }]
    });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const {
      address_line1,
      address_line2,
      city,
      state,
      country,
      pincode
    } = req.body;

    let profile = await UserProfile.findOne({
      where: { user_id: req.user.id }
    });

    let profilePicture = profile?.profile_picture;

    if (req.file) {
      const processedImage = await processImage(req.file, {
        width: 400,
        height: 400,
        quality: 85,
        format: 'jpeg'
      });
      profilePicture = path.join('uploads', 'profiles', processedImage.filename);

      // Delete old profile picture if exists
      if (profile?.profile_picture) {
        const oldImagePath = path.join(__dirname, '..', '..', profile.profile_picture);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
    }

    if (!profile) {
      profile = await UserProfile.create({
        user_id: req.user.id,
        address_line1,
        address_line2,
        city,
        state,
        country,
        pincode,
        profile_picture: profilePicture
      });
    } else {
      await profile.update({
        address_line1,
        address_line2,
        city,
        state,
        country,
        pincode,
        profile_picture: profilePicture
      });
    }

    res.json(profile);
  } catch (error) {
    console.error('Update user profile error:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors ? error.errors.map(e => e.message) : error.message
      });
    }
    res.status(500).json({
      message: error.message,
      stack: error.stack,
      fullError: error
    });
  }
};

// Delete profile picture
exports.deleteProfilePicture = async (req, res) => {
  try {
    const profile = await UserProfile.findOne({
      where: { user_id: req.user.id }
    });

    if (!profile || !profile.profile_picture) {
      return res.status(404).json({ message: 'Profile picture not found' });
    }

    const imagePath = path.join(__dirname, '..', '..', profile.profile_picture);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    await profile.update({ profile_picture: null });
    res.json({ message: 'Profile picture deleted successfully' });
  } catch (error) {
    console.error('Delete profile picture error:', error);
    if (error.name === 'SequelizeValidationError' || error.name === 'SequelizeUniqueConstraintError') {
      return res.status(400).json({
        message: 'Validation error',
        errors: error.errors ? error.errors.map(e => e.message) : error.message
      });
    }
    res.status(500).json({
      message: error.message,
      stack: error.stack,
      fullError: error
    });
  }
}; 