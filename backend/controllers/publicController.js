const db = require('../config/db');

// GET /api/timings
exports.getTimings = async (_req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT * FROM gym_timings
      ORDER BY FIELD(day,'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')
    `);
    res.json({ success: true, timings: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// GET /api/gallery
exports.getGallery = async (_req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM gym_images ORDER BY uploaded_at DESC');
    res.json({ success: true, images: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
