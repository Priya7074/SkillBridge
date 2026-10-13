const express = require('express');
const router = express.Router();
const {
  getAvailableRoles,
  analyzeSkillGap
} = require('../controllers/skillGapController');
const { protect } = require('../middleware/auth');

// GET /api/skill-gap/roles - Get available roles
router.get('/roles', protect, getAvailableRoles);

// POST /api/skill-gap/analyze - Analyze skill gap for a role
router.post('/analyze', protect, analyzeSkillGap);

module.exports = router;
