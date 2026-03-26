const db = require('../config/db');

class Message {
  static async create({ sender_id, receiver_id, order_id = null, message, sender_type = 'customer' }) {
    const sql = `
      INSERT INTO messages (sender_id, receiver_id, order_id, message, sender_type) 
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.execute(sql, [sender_id, receiver_id, order_id, message, sender_type]);
    return result.insertId;
  }

  static async findConversation(userId1, userId2) {
    const [rows] = await db.execute(`
      SELECT * FROM messages 
      WHERE (sender_id = ? AND receiver_id = ?) 
         OR (sender_id = ? AND receiver_id = ?)
      ORDER BY created_at ASC
    `, [userId1, userId2, userId2, userId1]);
    return rows;
  }

  static async findByUserId(userId) {
    const [rows] = await db.execute(`
      SELECT m.*, c.first_name, c.last_name, c.email
      FROM messages m
      JOIN customers c ON (m.sender_id = c.id OR m.receiver_id = c.id)
      WHERE (m.sender_id = ? OR m.receiver_id = ?)
      ORDER BY m.created_at DESC
    `, [userId, userId]);
    return rows;
  }

  static async getUnreadCount(userId) {
    const [rows] = await db.execute('SELECT COUNT(*) as count FROM messages WHERE receiver_id = ? AND is_read = 0', [userId]);
    return rows[0].count;
  }

  static async markAsRead(receiverId, senderId) {
    await db.execute('UPDATE messages SET is_read = 1 WHERE receiver_id = ? AND sender_id = ?', [receiverId, senderId]);
  }

  static async findAdminConversations() {
    const [rows] = await db.execute(`
      SELECT m.*, c.first_name, c.last_name, c.email, 
             (SELECT COUNT(*) FROM messages m2 WHERE m2.sender_id = c.id AND m2.receiver_id = m.receiver_id AND m2.is_read = 0) as unread_count
      FROM messages m
      JOIN customers c ON (m.sender_id = c.id AND m.sender_type = 'customer') OR (m.receiver_id = c.id AND m.sender_type = 'admin')
      WHERE m.id IN (
        SELECT MAX(id) FROM messages GROUP BY CASE WHEN sender_type = 'customer' THEN sender_id ELSE receiver_id END
      )
      ORDER BY m.created_at DESC
    `);
    return rows;
  }
}

module.exports = Message;
