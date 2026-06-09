const db = require('../config/db');

const Enquiry = {
  async create({ name, email, phone, message }) {
    const [result] = await db.execute(
      'INSERT INTO enquiries (name, email, phone, message) VALUES (?, ?, ?, ?)',
      [name, email, phone || null, message]
    );
    return result.insertId;
  },
  async findAll() {
    const [rows] = await db.execute('SELECT * FROM enquiries ORDER BY created_at DESC');
    return rows;
  },
  async delete(id) {
    const [result] = await db.execute('DELETE FROM enquiries WHERE id = ?', [id]);
    return result.affectedRows;
  }
};
module.exports = Enquiry;
