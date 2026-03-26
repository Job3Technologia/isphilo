const db = require('../config/db');

class Payment {
  static async create({ customer_id, order_id, amount, transaction_id, status, payment_method }) {
    const sql = `
      INSERT INTO payments 
      (customer_id, order_id, amount, transaction_id, status, payment_method) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [customer_id, order_id, amount, transaction_id, status, payment_method || 'Yoco']);
    return result.insertId;
  }

  static async findByOrderId(orderId) {
    const [rows] = await db.execute('SELECT * FROM payments WHERE order_id = ?', [orderId]);
    return rows[0];
  }

  static async findByCustomerId(customerId) {
    const [rows] = await db.execute('SELECT * FROM payments WHERE customer_id = ? ORDER BY payment_date DESC', [customerId]);
    return rows;
  }
}

module.exports = Payment;