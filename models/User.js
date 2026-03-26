const db = require('../config/db');

class User {
  static async create({ first_name, last_name, username, email, phone_number, password_hash, verification_token, token_expires_at }) {
    const sql = `
      INSERT INTO customers 
      (first_name, last_name, username, email, phone_number, password_hash, verification_token, token_expires_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [first_name, last_name, username, email, phone_number, password_hash, verification_token, token_expires_at]);
    return result.insertId;
  }

  static async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM customers WHERE email = ?', [email]);
    return rows[0];
  }

  static async findByUsername(username) {
    const [rows] = await db.execute('SELECT * FROM customers WHERE username = ?', [username]);
    return rows[0];
  }

  static async findById(id) {
    const [rows] = await db.execute(`
      SELECT id, first_name, last_name, username, email, phone_number, email_verified, account_status, last_login, 
             street_address, city, province, postal_code, country, profile_picture, date_of_birth, gender, 
             total_orders, total_spent, last_order_date, created_at 
      FROM customers WHERE id = ?
    `, [id]);
    return rows[0];
  }

  static async findByToken(token) {
    const [rows] = await db.execute('SELECT * FROM customers WHERE verification_token = ?', [token]);
    return rows[0];
  }

  static async verify(id) {
    const sql = 'UPDATE customers SET email_verified = TRUE, verification_token = NULL, token_expires_at = NULL WHERE id = ?';
    await db.execute(sql, [id]);
  }

  static async updateProfile(id, profileData) {
    const { first_name, last_name, phone_number, street_address, city, province, postal_code, country, date_of_birth, gender } = profileData;
    const sql = `
      UPDATE customers 
      SET first_name = ?, last_name = ?, phone_number = ?, street_address = ?, city = ?, province = ?, 
          postal_code = ?, country = ?, date_of_birth = ?, gender = ? 
      WHERE id = ?
    `;
    await db.execute(sql, [first_name, last_name, phone_number, street_address, city, province, postal_code, country, date_of_birth, gender, id]);
  }

  static async updateAvatar(id, imagePath) {
    const sql = 'UPDATE customers SET profile_picture = ? WHERE id = ?';
    await db.execute(sql, [imagePath, id]);
  }

  static async updateLastLogin(id) {
    const sql = 'UPDATE customers SET last_login = CURRENT_TIMESTAMP WHERE id = ?';
    await db.execute(sql, [id]);
  }

  static async updateStats(id, total_orders, total_spent, last_order_date) {
    const sql = 'UPDATE customers SET total_orders = ?, total_spent = ?, last_order_date = ? WHERE id = ?';
    await db.execute(sql, [total_orders, total_spent, last_order_date, id]);
  }

  static async updateVerificationToken(id, token, expires) {
    const sql = 'UPDATE customers SET verification_token = ?, token_expires_at = ? WHERE id = ?';
    await db.execute(sql, [token, expires, id]);
  }
}

module.exports = User;