const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  async create({ name, email, password, role = 'user' }) {
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await db.execute(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashed, role]
    );
    return result.insertId;
  },
  async findByEmail(email) {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },
  async findById(id) {
    const [rows] = await db.execute('SELECT id, name, email, role, created_at FROM users WHERE id = ?', [id]);
    return rows[0] || null;
  },
  async findAll() {
    const [rows] = await db.execute('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC');
    return rows;
  },
  async delete(id) {
    const [result] = await db.execute('DELETE FROM users WHERE id = ? AND role != "admin"', [id]);
    return result.affectedRows;
  },
  async comparePassword(plain, hashed) {
    return bcrypt.compare(plain, hashed);
  }
};
module.exports = User;
