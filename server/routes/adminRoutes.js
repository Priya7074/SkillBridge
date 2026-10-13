const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
  getAllApplications,
  updateApplicationStatus,
  getApplicationTrends
} = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');

// GET /api/admin/dashboard - Get dashboard statistics (admin only)
router.get('/dashboard', protect, admin, getDashboardStats);

// GET /api/admin/students - Get all students (admin only)
router.get('/students', protect, admin, getAllStudents);

// GET /api/admin/students/:id - Get student details (admin only)
router.get('/students/:id', protect, admin, getStudentById);

// PUT /api/admin/students/:id - Update student (admin only)
router.put('/students/:id', protect, admin, updateStudent);

// DELETE /api/admin/students/:id - Delete student (admin only)
router.delete('/students/:id', protect, admin, deleteStudent);

// GET /api/admin/applications - Get all applications (admin only)
router.get('/applications', protect, admin, getAllApplications);

// PUT /api/admin/applications/:id/status - Update application status (admin only)
router.put('/applications/:id/status', protect, admin, updateApplicationStatus);

// GET /api/admin/applications/trends - Get application trends (admin only)
router.get('/applications/trends', protect, admin, getApplicationTrends);

module.exports = router;
