const db = require('../config/db');

class Coupon {
  static async create({ code, discount_type, discount_value, min_spend, expiry_date, is_active }) {
    const sql = `
      INSERT INTO coupons (code, discount_type, discount_value, min_spend, expiry_date, is_active) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [code, discount_type, discount_value, min_spend, expiry_date, is_active]);
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await db.execute('SELECT * FROM coupons ORDER BY created_at DESC');
    return rows;
  }

  static async findByCode(code) {
    const [rows] = await db.execute('SELECT * FROM coupons WHERE code = ? AND is_active = 1', [code]);
    return rows[0];
  }

  static async update(id, { code, discount_type, discount_value, min_spend, expiry_date, is_active }) {
    const sql = `
      UPDATE coupons 
      SET code = ?, discount_type = ?, discount_value = ?, min_spend = ?, expiry_date = ?, is_active = ? 
      WHERE id = ?
    `;
    await db.execute(sql, [code, discount_type, discount_value, min_spend, expiry_date, is_active, id]);
  }

  static async delete(id) {
    await db.execute('DELETE FROM coupons WHERE id = ?', [id]);
  }

  static async validate(code, subtotal) {
    const coupon = await this.findByCode(code);
    if (!coupon) return { valid: false, msg: 'Invalid or inactive coupon code' };

    const now = new Date();
    if (coupon.expiry_date && new Date(coupon.expiry_date) < now) {
      return { valid: false, msg: 'Coupon code has expired' };
    }

    if (subtotal < coupon.min_spend) {
      return { valid: false, msg: `Minimum spend of R ${coupon.min_spend} required for this coupon` };
    }

    return { valid: true, coupon };
  }
}

module.exports = Coupon;
