const Enquiry = require('../models/Enquiry');

exports.submitEnquiry = async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !message)
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    const id = await Enquiry.create({ name, email, phone, message });
    res.status(201).json({ success: true, message: 'Enquiry submitted successfully', id });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.getEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.findAll();
    res.json({ success: true, enquiries });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

exports.deleteEnquiry = async (req, res) => {
  try {
    const deleted = await Enquiry.delete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: 'Enquiry not found' });
    res.json({ success: true, message: 'Enquiry deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
