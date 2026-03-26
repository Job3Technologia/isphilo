const nodemailer = require('nodemailer');
require('dotenv').config();

const sendVerificationEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const verificationUrl = `${process.env.BASE_URL}/api/auth/verify/${token}`;

  const mailOptions = {
    from: `"Isphilo Fragrance" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Welcome to Isphilo Fragrance!</h2>
        <p>Please verify your email address to complete your registration.</p>
        <p>Click the button below to verify your email:</p>
        <a href="${verificationUrl}" style="background-color: #D2B4DE; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verify Email</a>
        <p>This verification link will expire in 1 hour.</p>
        <p>If you did not create an account, please ignore this email.</p>
        <hr>
        <p>Thanks,</p>
        <p>The Isphilo Fragrance Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendPasswordResetEmail = async (email, token) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const resetUrl = `${process.env.BASE_URL}/reset-password.html?token=${token}`;

  const mailOptions = {
    from: `"Isphilo Fragrance" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2>Password Reset Request</h2>
        <p>You requested a password reset for your Isphilo Fragrance account.</p>
        <p>Click the button below to set a new password:</p>
        <a href="${resetUrl}" style="background-color: #D2B4DE; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
        <p>This link will expire in 1 hour.</p>
        <p>If you did not request this, please ignore this email.</p>
        <hr>
        <p>Thanks,</p>
        <p>The Isphilo Fragrance Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

const sendOTPEmail = async (email, otp) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Isphilo Fragrance" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verification Code - Isphilo Fragrance',
    html: `
      <div style="font-family: 'Arial', sans-serif; line-height: 1.6; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #000; letter-spacing: 2px;">ISPHILO <span style="color: #D42E2E;">FRAGRANCE</span></h1>
        </div>
        <div style="background: #f9f9f9; padding: 30px; text-align: center;">
          <h2 style="margin-top: 0;">Verification Code</h2>
          <p style="font-size: 16px;">Please use the 6-digit verification code below to complete your sign-in.</p>
          <div style="font-size: 32px; font-weight: bold; letter-spacing: 10px; color: #D42E2E; padding: 20px; border: 2px dashed #D42E2E; display: inline-block; margin: 20px 0;">
            ${otp}
          </div>
          <p style="color: #666; font-size: 14px;">This code will expire in <strong>5 minutes</strong>.</p>
        </div>
        <div style="margin-top: 30px; font-size: 14px; color: #888;">
          <p>If you did not request this code, please ignore this email or contact support if you have concerns.</p>
          <hr style="border: none; border-top: 1px solid #eee;">
          <p style="text-align: center;">&copy; 2026 Isphilo Fragrance. All rights reserved.</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendOTPEmail };