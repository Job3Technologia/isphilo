const crypto = require('crypto');

const generateVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

const generateOTP = () => {
  // Generate a secure 6-digit random number
  return Math.floor(100000 + Math.random() * 900000).toString();
};

module.exports = { generateVerificationToken, generateOTP };