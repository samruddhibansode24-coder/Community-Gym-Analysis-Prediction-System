const db = require('../config/db');

const GymImage = {
  async create({ image_path, caption }) {
    const [result] = await db.execute(
      'INSERT INTO gym_images (image_path, caption) VALUES (?, ?)',
      [image_path, caption || null]
    );
    return result.insertId;
  },
  async findAll() {
    const [rows] = await db.execute('SELECT * FROM gym_images ORDER BY uploaded_at DESC');
    return rows;
  },
  async delete(id) {
    const [rows] = await db.execute('SELECT image_path FROM gym_images WHERE id = ?', [id]);
    if (!rows[0]) return null;
    await db.execute('DELETE FROM gym_images WHERE id = ?', [id]);
    return rows[0].image_path;
  }
};
module.exports = GymImage;
