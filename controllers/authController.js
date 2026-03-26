const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Token = require('../models/Token');
const Otp = require('../models/Otp');
const { generateVerificationToken, generateOTP } = require('../utils/token');
const { sendVerificationEmail, sendOTPEmail } = require('../utils/email');

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.JWT_REFRESH_SECRET, { expiresIn: '7d' });
};

// Helper to handle OTP generation and email
const handleOTPFlow = async (email) => {
  const otpCode = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes
  
  // Hash OTP before storage
  const salt = await bcrypt.genSalt(10);
  const hashedOtp = await bcrypt.hash(otpCode, salt);
  
  await Otp.create(email, hashedOtp, expiresAt);
  await sendOTPEmail(email, otpCode);
  return true;
};

exports.register = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password, first_name, last_name, username, phone_number } = req.body;

  try {
    const existingUser = await User.findByEmail(email);
    if (existingUser) return res.status(400).json({ msg: 'Email already registered' });

    if (username) {
      const existingUsername = await User.findByUsername(username);
      if (existingUsername) return res.status(400).json({ msg: 'Username already taken' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const userId = await User.create({ 
      first_name, 
      last_name, 
      username, 
      email, 
      phone_number, 
      password_hash: hashedPassword, 
      verification_token: null, // No longer used, using OTP
      token_expires_at: null 
    });

    await handleOTPFlow(email);

    res.status(201).json({ 
      msg: 'Registration successful. Verification code sent to your email.',
      redirect: 'verify-otp.html',
      email: email 
    });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;

  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    if (user.account_status !== 'Active') return res.status(403).json({ msg: `Account ${user.account_status}` });

    // If email is not verified, require OTP verification
    if (!user.email_verified) {
      await handleOTPFlow(email);
      return res.status(200).json({ 
        msg: 'Email verification required. Verification code sent.',
        redirect: 'verify-otp.html',
        email: email 
      });
    }

    // Normal Login Success
    await User.updateLastLogin(user.id);

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    await Token.save(user.id, refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ 
      accessToken, 
      user: { 
        id: user.id, 
        email: user.email, 
        first_name: user.first_name, 
        last_name: user.last_name,
        username: user.username 
      } 
    });
  } catch (err) {
    next(err);
  }
};

exports.logout = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  try {
    if (refreshToken) {
      await Token.delete(refreshToken);
    }
    res.clearCookie('refreshToken');
    res.json({ msg: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

exports.refresh = async (req, res, next) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) return res.status(401).json({ msg: 'No refresh token' });

  try {
    const storedToken = await Token.find(refreshToken);
    if (!storedToken) return res.status(403).json({ msg: 'Invalid refresh token' });

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    next(err);
  }
};

exports.verifyOTP = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const otpData = await Otp.findLatestByEmail(email);
    if (!otpData) return res.status(400).json({ msg: 'No verification request found' });

    if (otpData.verified) return res.status(400).json({ msg: 'OTP already verified' });
    if (otpData.attempts >= 3) return res.status(403).json({ msg: 'Max attempts reached. Please request a new code.' });
    if (new Date() > otpData.expires_at) return res.status(400).json({ msg: 'OTP has expired. Please request a new code.' });

    const isMatch = await bcrypt.compare(otp, otpData.otp);
    if (!isMatch) {
      await Otp.incrementAttempts(otpData.id);
      const remaining = 3 - (otpData.attempts + 1);
      if (remaining <= 0) {
        return res.status(403).json({ msg: 'Max attempts reached. This code is now invalid.' });
      }
      return res.status(400).json({ msg: `Invalid code. ${remaining} attempts remaining.` });
    }

    // Success
    await Otp.markAsVerified(otpData.id);
    const user = await User.findByEmail(email);
    await User.verify(user.id);
    await User.updateLastLogin(user.id);

    // Auto Login after verification
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    await Token.save(user.id, refreshToken);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({ 
      msg: 'Verification successful',
      accessToken,
      user: { 
        id: user.id, 
        email: user.email, 
        first_name: user.first_name, 
        last_name: user.last_name,
        username: user.username 
      }
    });
  } catch (err) {
    next(err);
  }
};

exports.resendOTP = async (req, res, next) => {
  const { email } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    // Security: Check if we already sent one recently (within last 30 seconds)
    const lastOtp = await Otp.findLatestByEmail(email);
    if (lastOtp && (new Date() - lastOtp.created_at) < 30 * 1000) {
      return res.status(429).json({ msg: 'Please wait 30 seconds before requesting a new code.' });
    }
    
    await handleOTPFlow(email);
    res.json({ msg: 'A new verification code has been sent to your email.' });
  } catch (err) {
    next(err);
  }
};