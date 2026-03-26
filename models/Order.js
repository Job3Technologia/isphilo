const db = require('../config/db');

class Order {
  static async create({ customer_id, order_number, subtotal, discount, shipping_cost, total, payment_method, shipping_address, items, shipping_method, delivery_details, tracking_number }) {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const orderSql = `
        INSERT INTO orders 
        (order_number, customer_id, subtotal, discount, shipping_cost, total, payment_method, shipping_address, shipping_method, delivery_details, tracking_number) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
      const [orderResult] = await connection.execute(orderSql, [
        order_number, customer_id, subtotal, discount, shipping_cost, total, payment_method, shipping_address, shipping_method, JSON.stringify(delivery_details), tracking_number
      ]);
      const orderId = orderResult.insertId;

      const itemSql = 'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)';
      for (const item of items) {
        await connection.execute(itemSql, [orderId, item.product_id, item.quantity, item.price]);
      }

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  static async findByUserId(customerId, limit = null) {
    let sql = 'SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC';
    const params = [customerId];
    
    if (limit) {
      sql += ' LIMIT ?';
      params.push(limit);
    }
    
    const [rows] = await db.execute(sql, params);
    return rows;
  }

  static async getStats(customerId) {
    const [rows] = await db.execute(`
      SELECT 
        COUNT(*) as total_orders, 
        SUM(total) as total_spent,
        (
          SELECT c.name 
          FROM order_items oi
          JOIN products p ON oi.product_id = p.id
          JOIN categories c ON p.category_id = c.id
          JOIN orders o2 ON oi.order_id = o2.id
          WHERE o2.customer_id = ?
          GROUP BY c.id
          ORDER BY COUNT(*) DESC
          LIMIT 1
        ) as top_category
      FROM orders 
      WHERE customer_id = ?
    `, [customerId, customer_id]);
    return rows[0];
  }

  static async getRecent(customerId, limit = 5) {
    const [rows] = await db.execute('SELECT * FROM orders WHERE customer_id = ? ORDER BY created_at DESC LIMIT ?', [customerId, limit]);
    return rows;
  }

  static async updateStatus(id, status, tracking_number = null) {
    let sql = 'UPDATE orders SET status = ?';
    const params = [status];
    
    if (tracking_number) {
      sql += ', tracking_number = ?';
      params.push(tracking_number);
    }
    
    if (status === 'dispatched') {
      sql += ', dispatched_at = CURRENT_TIMESTAMP';
    } else if (status === 'delivered') {
      sql += ', delivered_at = CURRENT_TIMESTAMP';
    }
    
    sql += ' WHERE id = ?';
    params.push(id);
    
    await db.execute(sql, params);
  }

  static async findAll() {
    const [rows] = await db.execute(`
      SELECT o.*, c.first_name, c.last_name, c.email as customer_email
      FROM orders o
      LEFT JOIN customers c ON o.customer_id = c.id
      ORDER BY o.created_at DESC
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.execute(`
      SELECT o.*, 
             JSON_ARRAYAGG(
               JSON_OBJECT(
                 'id', oi.id,
                 'product_id', oi.product_id,
                 'quantity', oi.quantity,
                 'price', oi.price,
                 'product_name', p.name
               )
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      LEFT JOIN products p ON oi.product_id = p.id
      WHERE o.id = ? 
      GROUP BY o.id
    `, [id]);
    return rows[0];
  }
}

module.exports = Order;