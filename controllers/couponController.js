const Coupon = require('../models/Coupon');

exports.getAllCoupons = async (req, res, next) => {
  try {
    const coupons = await Coupon.findAll();
    res.json(coupons);
  } catch (err) {
    next(err);
  }
};

exports.createCoupon = async (req, res, next) => {
  try {
    const couponId = await Coupon.create(req.body);
    res.status(201).json({ id: couponId, msg: 'Coupon created successfully' });
  } catch (err) {
    next(err);
  }
};

exports.updateCoupon = async (req, res, next) => {
  try {
    await Coupon.update(req.params.id, req.body);
    res.json({ msg: 'Coupon updated successfully' });
  } catch (err) {
    next(err);
  }
};

exports.deleteCoupon = async (req, res, next) => {
  try {
    await Coupon.delete(req.params.id);
    res.json({ msg: 'Coupon deleted successfully' });
  } catch (err) {
    next(err);
  }
};

exports.validateCoupon = async (req, res, next) => {
  const { code, subtotal } = req.body;
  try {
    const result = await Coupon.validate(code, subtotal);
    if (!result.valid) {
      return res.status(400).json({ msg: result.msg });
    }
    res.json(result.coupon);
  } catch (err) {
    next(err);
  }
};
