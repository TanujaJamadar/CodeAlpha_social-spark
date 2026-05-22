const router = require('express').Router();
const { protect, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { createPost, getFeed, getPost, updatePost, deletePost } = require('../controllers/postController');
const { listForPost, addComment } = require('../controllers/commentController');
const { likePost, unlikePost } = require('../controllers/likeController');
const { savePost, unsavePost } = require('../controllers/saveController');

router.get('/', optionalAuth, getFeed);
router.post('/', protect, upload.single('image'), createPost);

router.get('/:id', optionalAuth, getPost);
router.put('/:id', protect, upload.single('image'), updatePost);
router.delete('/:id', protect, deletePost);

router.post('/:id/like', protect, likePost);
router.delete('/:id/like', protect, unlikePost);

router.post('/:id/save', protect, savePost);
router.delete('/:id/save', protect, unsavePost);

router.get('/:postId/comments', listForPost);
router.post('/:postId/comments', protect, addComment);

module.exports = router;
