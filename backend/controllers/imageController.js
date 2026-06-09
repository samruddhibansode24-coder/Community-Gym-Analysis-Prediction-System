const GymImage = require('../models/GymImage');
const path = require('path');
const fs = require('fs');

exports.getImages = async (req, res) => {
  try {
    const images = await GymImage.findAll();
    res.json({ success: true, images });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image uploaded' });
    const image_path = `/uploads/${req.file.filename}`;
    const caption = req.body.caption || '';
    const id = await GymImage.create({ image_path, caption });
    res.status(201).json({ success: true, message: 'Image uploaded', id, image_path });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const imagePath = await GymImage.delete(req.params.id);
    if (!imagePath) return res.status(404).json({ success: false, message: 'Image not found' });
    const fullPath = path.join(__dirname, '..', 'uploads', path.basename(imagePath));
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    res.json({ success: true, message: 'Image deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
