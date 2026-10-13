require('dotenv').config();
if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error('JWT_SECRET must be configured with at least 32 characters');
}
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const skillRoutes = require('./routes/skillRoutes');
const internshipRoutes = require('./routes/internshipRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const savedInternshipRoutes = require('./routes/savedInternshipRoutes');
const adminRoutes = require('./routes/adminRoutes');
const skillGapRoutes = require('./routes/skillGapRoutes');
const searchRoutes = require('./routes/searchRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

// Initialize express app
const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const allowedOrigins = new Set([
  ...(process.env.CLIENT_URL || '').split(',').map(origin => origin.trim()).filter(Boolean),
  'http://localhost:5173',
  'http://localhost:5174'
]);

const corsOptions = {
  origin: (origin, callback) => {
    callback(null, Boolean(origin && allowedOrigins.has(origin)));
  }
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '8mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/internships', internshipRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/saved-internships', savedInternshipRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/skill-gap', skillGapRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/notifications', notificationRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'SkillBridge API Server',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      skills: '/api/skills',
      internships: '/api/internships',
      applications: '/api/applications',
      savedInternships: '/api/saved-internships'
    }
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Handle 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
