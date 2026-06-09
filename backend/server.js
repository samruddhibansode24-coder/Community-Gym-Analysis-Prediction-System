require('dotenv').config();
const dbPool = require('./config/db');
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// CORS - Allow all for development (fixes Live Server / VSCode preview)
app.use(cors({
  origin: true,
  credentials: true
}));

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Serve frontend static files
app.use(express.static(path.join(__dirname, '../frontend')));

app.get('/', (req, res) => {
  res.send('Backend Running 🚀');
});

// Routes
app.use('/api/auth',      require('./routes/auth'));
app.use('/api/reviews',   require('./routes/reviews'));
app.use('/api/enquiries', require('./routes/enquiries'));
app.use('/api/images',    require('./routes/images'));
app.use('/api/timings',   require('./routes/timings'));
app.use('/api/admin',     require('./routes/admin'));

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', timestamp: new Date() }));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({ success: false, message: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log('✅ CORS: All origins allowed (development)');
});
