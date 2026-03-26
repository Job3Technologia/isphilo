const Order = require('../models/Order');

exports.createOrder = async (req, res, next) => {
  const { subtotal, discount, shipping_cost, total, payment_method, shipping_address, items, shipping_method, delivery_details } = req.body;
  const order_number = 'ORD-' + Date.now();
  
  try {
    const orderId = await Order.create({ 
      customer_id: req.user.id, 
      order_number,
      subtotal, 
      discount, 
      shipping_cost, 
      total, 
      payment_method, 
      shipping_address, 
      items,
      shipping_method,
      delivery_details,
      tracking_number: null // Will be added by admin later
    });
    res.status(201).json({ msg: 'Order placed successfully', orderId, order_number });
  } catch (err) {
    next(err);
  }
};

exports.updateOrderStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status, tracking_number } = req.body;
  
  try {
    await Order.updateStatus(id, status, tracking_number);
    res.json({ msg: 'Order status updated successfully' });
  } catch (err) {
    next(err);
  }
};

exports.getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (err) {
    next(err);
  }
};

exports.getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ msg: 'Order not found' });
    res.json(order);
  } catch (err) {
    next(err);
  }
};

exports.getOrders = async (req, res, next) => {
  const { limit } = req.query;
  try {
    const orders = await Order.findByUserId(req.user.id, limit ? parseInt(limit) : null);
    res.json(orders);
  } catch (err) {
    next(err);
  }
};