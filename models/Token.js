const db = require('../config/db');

class Token {
  static async save(userId, token) {
    const sql = 'INSERT INTO refresh_tokens (user_id, token) VALUES (?, ?)';
    await db.execute(sql, [userId, token]);
  }

  static async find(token) {
    const [rows] = await db.execute('SELECT * FROM refresh_tokens WHERE token = ?', [token]);
    return rows[0];
  }

  static async delete(token) {
    await db.execute('DELETE FROM refresh_tokens WHERE token = ?', [token]);
  }

  static async deleteAllForUser(userId) {
    await db.execute('DELETE FROM refresh_tokens WHERE user_id = ?', [userId]);
  }
}

module.exports = Token;