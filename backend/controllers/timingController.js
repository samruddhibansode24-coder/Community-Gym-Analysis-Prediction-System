const GymTiming = require('../models/GymTiming');

exports.getTimings = async (req, res) => {
  try {
    const timings = await GymTiming.findAll();
    res.json({ success: true, timings });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.updateTiming = async (req, res) => {
  try {
    const { day } = req.params;
    const { open_time, close_time, is_closed } = req.body;
    const updated = await GymTiming.update(day, { open_time, close_time, is_closed });
    if (!updated) return res.status(404).json({ success: false, message: 'Day not found' });
    res.json({ success: true, message: 'Timing updated' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
