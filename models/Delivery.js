const db = require('../config/db');

class Delivery {
  static async create(deliveryData) {
    const {
      order_id,
      delivery_id,
      customer_name,
      delivery_address,
      product_name,
      quantity_delivered,
      price_per_unit,
      total_sale,
      delivery_fee,
      payment_method,
      time_dispatched,
      time_delivered,
      delivery_status
    } = deliveryData;

    const [result] = await db.query(
      `INSERT INTO deliveries (
        order_id, delivery_id, customer_name, delivery_address, 
        product_name, quantity_delivered, price_per_unit, total_sale, 
        delivery_fee, payment_method, time_dispatched, time_delivered, 
        delivery_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        order_id, delivery_id, customer_name, delivery_address,
        product_name, quantity_delivered, price_per_unit, total_sale,
        delivery_fee, payment_method, time_dispatched, time_delivered,
        delivery_status
      ]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM deliveries ORDER BY created_at DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM deliveries WHERE id = ?', [id]);
    return rows[0];
  }

  static async findByDeliveryId(deliveryId) {
    const [rows] = await db.query('SELECT * FROM deliveries WHERE delivery_id = ?', [deliveryId]);
    return rows[0];
  }

  static async updateStatus(id, status, timeField = null) {
    let query = 'UPDATE deliveries SET delivery_status = ?';
    let params = [status];
    
    if (timeField === 'time_dispatched') {
      query += ', time_dispatched = CURRENT_TIMESTAMP';
    } else if (timeField === 'time_delivered') {
      query += ', time_delivered = CURRENT_TIMESTAMP';
    }
    
    query += ' WHERE id = ?';
    params.push(id);

    const [result] = await db.query(query, params);
    return result.affectedRows > 0;
  }
}

module.exports = Delivery;