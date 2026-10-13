const express = require('express');
const router = express.Router();
const {
  getAllSavedInternships,
  createSavedInternship,
  deleteSavedInternship
} = require('../controllers/savedInternshipController');
const { protect } = require('../middleware/auth');

// GET /api/saved-internships (protected)
router.get('/', protect, getAllSavedInternships);

// POST /api/saved-internships (protected)
router.post('/', protect, createSavedInternship);

// DELETE /api/saved-internships/:id (protected)
router.delete('/:id', protect, deleteSavedInternship);

module.exports = router;
