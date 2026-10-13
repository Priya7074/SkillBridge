const express = require('express');
const router = express.Router();
const {
  getAllApplications,
  getApplicationById,
  createApplication,
  updateApplication
} = require('../controllers/applicationController');
const { protect } = require('../middleware/auth');

// GET /api/applications (protected)
router.get('/', protect, getAllApplications);

// GET /api/applications/:id (protected)
router.get('/:id', protect, getApplicationById);

// POST /api/applications (protected)
router.post('/', protect, createApplication);

// PUT /api/applications/:id (protected)
router.put('/:id', protect, updateApplication);

module.exports = router;
