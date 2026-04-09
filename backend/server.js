require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'ok', timestamp: new Date() }));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/eper/activities', require('./routes/activityRoutes'));
app.use('/api/eper/wdt', require('./routes/wdtRoutes'));
app.use('/api/eper/sixbysix', require('./routes/sixBySixRoutes'));
app.use('/api/eper/fitment', require('./routes/fitmentRoutes'));
app.use('/api/eper/reports', require('./routes/reportsRoutes'));
app.use('/api/eper/ai', require('./routes/aiRoutes'));
app.use('/api/eper/settings', require('./routes/settingsRoutes'));

// Connect to MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    app.listen(PORT, () => {
      console.log(`🚀 ePER Backend running on http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

module.exports = app;
