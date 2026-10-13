const express = require('express');
const {
  getMyNotifications,
  markNotificationRead
} = require('../controllers/notificationController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, getMyNotifications);
router.patch('/:id/read', protect, markNotificationRead);

module.exports = router;
