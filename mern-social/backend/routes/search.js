const router = require('express').Router();
const { optionalAuth } = require('../middleware/auth');
const { search } = require('../controllers/searchController');

router.get('/', optionalAuth, search);

module.exports = router;
