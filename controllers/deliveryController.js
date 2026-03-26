const Delivery = require('../models/Delivery');

exports.getDeliveries = async (req, res, next) => {
  try {
    const deliveries = await Delivery.findAll();
    res.json(deliveries);
  } catch (err) {
    next(err);
  }
};

exports.getDeliveryById = async (req, res, next) => {
  try {
    const delivery = await Delivery.findById(req.params.id);
    if (!delivery) return res.status(404).json({ msg: 'Delivery record not found' });
    res.json(delivery);
  } catch (err) {
    next(err);
  }
};

exports.getDeliveryByTrackingId = async (req, res, next) => {
  try {
    const delivery = await Delivery.findByDeliveryId(req.params.delivery_id);
    if (!delivery) return res.status(404).json({ msg: 'Delivery tracking ID not found' });
    res.json(delivery);
  } catch (err) {
    next(err);
  }
};

exports.createDelivery = async (req, res, next) => {
  try {
    const deliveryId = await Delivery.create(req.body);
    res.status(201).json({ msg: 'Delivery record created', id: deliveryId });
  } catch (err) {
    next(err);
  }
};

exports.updateDeliveryStatus = async (req, res, next) => {
  const { status, time_field } = req.body;
  try {
    const success = await Delivery.updateStatus(req.params.id, status, time_field);
    if (!success) return res.status(404).json({ msg: 'Delivery record not found' });
    res.json({ msg: 'Delivery status updated' });
  } catch (err) {
    next(err);
  }
};