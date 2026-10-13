const express = require('express');
const router = express.Router();
const {
  getAllInternships,
  getInternshipById,
  createInternship,
  updateInternship,
  deleteInternship
} = require('../controllers/internshipController');
const { protect, admin } = require('../middleware/auth');

// GET /api/internships (public)
router.get('/', getAllInternships);

// GET /api/internships/:id (public)
router.get('/:id', getInternshipById);

// POST /api/internships (protected - admin only)
router.post('/', protect, admin, createInternship);

// PUT /api/internships/:id (protected - admin only)
router.put('/:id', protect, admin, updateInternship);

// DELETE /api/internships/:id (protected - admin only)
router.delete('/:id', protect, admin, deleteInternship);

module.exports = router;
