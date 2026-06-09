const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { getImages, uploadImage, deleteImage } = require('../controllers/imageController');
const { protect, adminOnly } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../uploads')),
  filename: (req, file, cb) => cb(null, `gym_${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({
  storage,
  limits: { fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5242880 },
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|webp|gif/;
    if (allowed.test(path.extname(file.originalname).toLowerCase())) cb(null, true);
    else cb(new Error('Only image files allowed'));
  }
});

router.get('/', getImages);
router.post('/', protect, adminOnly, upload.single('image'), uploadImage);
router.delete('/:id', protect, adminOnly, deleteImage);

module.exports = router;
