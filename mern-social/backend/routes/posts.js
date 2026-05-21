const router = require('express').Router();
const { protect, optionalAuth } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { createPost, getFeed, getPost, updatePost, deletePost } = require('../controllers/postController');
const { listForPost, addComment } = require('../controllers/commentController');

router.get('/', optionalAuth, getFeed);
router.post('/', protect, upload.single('image'), createPost);

router.get('/:id', getPost);
router.put('/:id', protect, upload.single('image'), updatePost);
router.delete('/:id', protect, deletePost);

router.get('/:postId/comments', listForPost);
router.post('/:postId/comments', protect, addComment);

module.exports = router;
