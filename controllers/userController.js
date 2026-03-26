const User = require('../models/User');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    await User.updateProfile(req.user.id, req.body);
    res.json({ msg: 'Profile updated successfully' });
  } catch (err) {
    next(err);
  }
};

exports.uploadAvatar = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'Please upload an image' });
    
    const imagePath = `/uploads/${req.file.filename}`;
    await User.updateAvatar(req.user.id, imagePath);
    
    res.json({ msg: 'Avatar updated successfully', profile_picture: imagePath });
  } catch (err) {
    next(err);
  }
};