const axios = require('axios');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const User = require('../models/User');

exports.processYocoPayment = async (req, res, next) => {
  const { token, amountInCents, currency, customer_id, order_id } = req.body;

  try {
    // 1. Call Yoco API to process charge
    const response = await axios.post('https://online.yoco.com/v1/charges/', {
      token: token,
      amountInCents: amountInCents,
      currency: currency || 'ZAR'
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.YOCO_SECRET_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (response.data.status === 'successful') {
      // 2. Update Order Status
      // Assuming we have an Order model method for this
      // await Order.updateStatus(order_id, 'paid');

      // 3. Log Payment in Database
      const amount = amountInCents / 100;
      await Payment.create({
        customer_id,
        order_id,
        amount,
        transaction_id: response.data.id,
        status: 'Success',
        payment_method: 'Yoco'
      });

      // 4. Update Customer Stats
      const customer = await User.findById(customer_id);
      if (customer) {
        const newTotalSpent = parseFloat(customer.total_spent) + amount;
        const newTotalOrders = customer.total_orders + 1;
        await User.updateStats(customer_id, newTotalOrders, newTotalSpent, new Date());
      }

      res.json({ success: true, message: 'Payment successful', transaction_id: response.data.id });
    } else {
      res.status(400).json({ success: false, message: 'Payment failed', details: response.data });
    }
  } catch (err) {
    console.error('Yoco Payment Error:', err.response ? err.response.data : err.message);
    res.status(500).json({ success: false, message: 'Payment processing error', error: err.message });
  }
};