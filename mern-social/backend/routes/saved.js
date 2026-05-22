const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { listSaved } = require('../controllers/saveController');

router.get('/', protect, listSaved);

module.exports = router;
