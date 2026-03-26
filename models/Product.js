const db = require('../config/db');

class Product {
  static async findAll() {
    const [rows] = await db.query(`
      SELECT p.*, pi.image_path as image 
      FROM products p 
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      WHERE p.is_active = 1
    `);
    return rows;
  }

  static async findById(id) {
    const [rows] = await db.query(`
      SELECT p.*, pi.image_path as image 
      FROM products p 
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      WHERE p.id = ?
    `, [id]);
    return rows[0];
  }

  static async findByCategory(categoryId) {
    const [rows] = await db.query(`
      SELECT p.*, pi.image_path as image 
      FROM products p 
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      WHERE p.category_id = ? AND p.is_active = 1
    `, [categoryId]);
    return rows;
  }

  static async findFeatured() {
    const [rows] = await db.query(`
      SELECT p.*, pi.image_path as image 
      FROM products p 
      LEFT JOIN product_images pi ON p.id = pi.product_id AND pi.is_primary = 1
      WHERE p.is_featured = 1 AND p.is_active = 1
    `);
    return rows;
  }
}

module.exports = Product;