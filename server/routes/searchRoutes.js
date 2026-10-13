const express = require('express');
const { searchContent } = require('../controllers/searchController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.get('/', protect, searchContent);

module.exports = router;
