const db = require('../config/db');

const Review = {
  async create({ user_id, rating, review }) {
    const [result] = await db.execute(
      'INSERT INTO reviews (user_id, rating, review) VALUES (?, ?, ?)',
      [user_id, rating, review]
    );
    return result.insertId;
  },
  async findAll() {
    const [rows] = await db.execute(
      `SELECT r.id, r.rating, r.review, r.created_at, u.name AS user_name
       FROM reviews r JOIN users u ON r.user_id = u.id
       ORDER BY r.created_at DESC`
    );
    return rows;
  },
  async getStats() {
    const [rows] = await db.execute('SELECT COUNT(*) AS total, AVG(rating) AS average FROM reviews');
    return rows[0];
  },
  async delete(id) {
    const [result] = await db.execute('DELETE FROM reviews WHERE id = ?', [id]);
    return result.affectedRows;
  }
};
module.exports = Review;
