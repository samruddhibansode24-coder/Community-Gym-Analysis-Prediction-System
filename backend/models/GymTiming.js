const db = require('../config/db');

const GymTiming = {
  async findAll() {
    const [rows] = await db.execute(
      'SELECT * FROM gym_timings ORDER BY FIELD(day,"Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday")'
    );
    return rows;
  },
  async update(day, { open_time, close_time, is_closed }) {
    const [result] = await db.execute(
      'UPDATE gym_timings SET open_time=?, close_time=?, is_closed=? WHERE day=?',
      [open_time || null, close_time || null, is_closed ? 1 : 0, day]
    );
    return result.affectedRows;
  }
};
module.exports = GymTiming;
