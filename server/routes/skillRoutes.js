const express = require('express');
const router = express.Router();
const {
  getAllSkills,
  createSkill,
  updateSkill,
  deleteSkill
} = require('../controllers/skillController');
const { protect } = require('../middleware/auth');

// GET /api/skills (protected)
router.get('/', protect, getAllSkills);

// POST /api/skills (protected)
router.post('/', protect, createSkill);

// PUT /api/skills/:id (protected)
router.put('/:id', protect, updateSkill);

// DELETE /api/skills/:id (protected)
router.delete('/:id', protect, deleteSkill);

module.exports = router;
