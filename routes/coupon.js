const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { protect, admin } = require('../middleware/auth');

// Public route for validation during checkout
router.post('/validate', couponController.validateCoupon);

// Admin routes for managing coupons
router.get('/', protect, admin, couponController.getAllCoupons);
router.post('/', protect, admin, couponController.createCoupon);
router.put('/:id', protect, admin, couponController.updateCoupon);
router.delete('/:id', protect, admin, couponController.deleteCoupon);

module.exports = router;
