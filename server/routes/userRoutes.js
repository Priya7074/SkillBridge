const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  updateUser,
  updateResume
} = require('../controllers/userController');
const { protect, admin } = require('../middleware/auth');

// User directory endpoints are restricted to administrators.
router.get('/', protect, admin, getAllUsers);

router.get('/:id', protect, admin, getUserById);

// PUT /api/users/:id (protected)
router.put('/:id', protect, updateUser);

// PUT /api/users/me/resume (protected - update current user's resume)
router.put('/me/resume', protect, updateResume);

module.exports = router;
