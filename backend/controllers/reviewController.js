const Review = require('../models/Review');

exports.getReviews = async (req, res) => {
  try {
    const [reviews, stats] = await Promise.all([Review.findAll(), Review.getStats()]);
    res.json({ success: true, reviews, stats: { total: stats.total, average: parseFloat(stats.average || 0).toFixed(1) } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.createReview = async (req, res) => {
  try {
    const { rating, review } = req.body;
    if (!rating || !review)
      return res.status(400).json({ success: false, message: 'Rating and review are required' });
    if (rating < 1 || rating > 5)
      return res.status(400).json({ success: false, message: 'Rating must be 1-5' });
    const id = await Review.create({ user_id: req.user.id, rating, review });
    res.status(201).json({ success: true, message: 'Review submitted', id });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteReview = async (req, res) => {
  try {
    const deleted = await Review.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, message: 'Review deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
