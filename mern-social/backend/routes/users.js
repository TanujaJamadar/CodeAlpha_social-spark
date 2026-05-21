const router = require('express').Router();
const { protect, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
  getProfile, updateProfile, followUser, unfollowUser, suggestedUsers, exploreUsers,
} = require('../controllers/userController');
const { getUserPosts } = require('../controllers/postController');

router.get('/suggested', protect, suggestedUsers);
router.get('/explore', optionalAuth, exploreUsers);

router.put('/me', protect, upload.single('avatar'), updateProfile);

router.get('/:username', optionalAuth, getProfile);
router.get('/:username/posts', getUserPosts);
router.post('/:username/follow', protect, followUser);
router.delete('/:username/follow', protect, unfollowUser);

module.exports = router;
