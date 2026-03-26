const db = require('../config/db');

class Expense {
  static async create(expenseData) {
    const {
      expense_date,
      category,
      description,
      amount,
      delivery_id
    } = expenseData;

    const [result] = await db.query(
      `INSERT INTO expenses (
        expense_date, category, description, amount, delivery_id
      ) VALUES (?, ?, ?, ?, ?)`,
      [expense_date, category, description, amount, delivery_id]
    );
    return result.insertId;
  }

  static async findAll() {
    const [rows] = await db.query('SELECT * FROM expenses ORDER BY expense_date DESC');
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query('SELECT * FROM expenses WHERE id = ?', [id]);
    return rows[0];
  }

  static async delete(id) {
    const [result] = await db.query('DELETE FROM expenses WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }
}

module.exports = Expense;