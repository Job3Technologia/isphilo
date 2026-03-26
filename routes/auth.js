const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const authController = require('../controllers/authController');

router.post(
  '/register',
  [
    check('email', 'Valid email required').isEmail(),
    check('password', 'Min 6 characters').isLength({ min: 6 }),
    check('first_name', 'First name required').notEmpty(),
    check('last_name', 'Last name required').notEmpty()
  ],
  authController.register
);

router.post(
  '/login',
  [
    check('email', 'Valid email required').isEmail(),
    check('password', 'Password required').notEmpty()
  ],
  authController.login
);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.post('/verify-otp', authController.verifyOTP);
router.post('/resend-otp', authController.resendOTP);

module.exports = router;