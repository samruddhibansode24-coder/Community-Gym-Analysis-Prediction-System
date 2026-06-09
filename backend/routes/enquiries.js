const express = require('express');
const router = express.Router();
const { submitEnquiry, getEnquiries, deleteEnquiry } = require('../controllers/enquiryController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/', submitEnquiry);
router.get('/', protect, adminOnly, getEnquiries);
router.delete('/:id', protect, adminOnly, deleteEnquiry);

module.exports = router;
