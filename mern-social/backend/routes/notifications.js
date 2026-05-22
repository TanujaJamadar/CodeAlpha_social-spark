const router = require('express').Router();
const { protect } = require('../middleware/auth');
const { list, unreadCount, markAllRead } = require('../controllers/notificationController');

router.get('/', protect, list);
router.get('/unread-count', protect, unreadCount);
router.post('/read-all', protect, markAllRead);

module.exports = router;
