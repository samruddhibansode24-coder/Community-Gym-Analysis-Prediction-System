const express = require('express');
const router = express.Router();
const { getTimings, updateTiming } = require('../controllers/timingController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getTimings);
router.put('/:day', protect, adminOnly, updateTiming);

module.exports = router;
