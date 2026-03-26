const db = require('../config/db');

class Otp {
  static async create(email, otp, expiresAt) {
    // Delete any existing OTPs for this email first to prevent clutter
    await db.execute('DELETE FROM otps WHERE email = ?', [email]);
    
    const sql = 'INSERT INTO otps (email, otp, expires_at) VALUES (?, ?, ?)';
    const [result] = await db.execute(sql, [email, otp, expiresAt]);
    return result.insertId;
  }

  static async findLatestByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM otps WHERE email = ? ORDER BY created_at DESC LIMIT 1', [email]);
    return rows[0];
  }

  static async incrementAttempts(id) {
    await db.execute('UPDATE otps SET attempts = attempts + 1 WHERE id = ?', [id]);
  }

  static async markAsVerified(id) {
    await db.execute('UPDATE otps SET verified = 1 WHERE id = ?', [id]);
  }

  static async deleteByEmail(email) {
    await db.execute('DELETE FROM otps WHERE email = ?', [email]);
  }
}

module.exports = Otp;
