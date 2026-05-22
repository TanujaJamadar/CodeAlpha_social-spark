const SavedPost = require('../models/SavedPost');
const Post = require('../models/Post');

exports.savePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    try {
      await SavedPost.create({ post: post._id, user: req.user._id });
    } catch (e) { if (e.code !== 11000) throw e; }
    res.json({ saved: true });
  } catch (err) { next(err); }
};

exports.unsavePost = async (req, res, next) => {
  try {
    await SavedPost.findOneAndDelete({ post: req.params.id, user: req.user._id });
    res.json({ saved: false });
  } catch (err) { next(err); }
};

exports.listSaved = async (req, res, next) => {
  try {
    const items = await SavedPost.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate({ path: 'post', populate: { path: 'author', select: 'username name avatar' } });
    const posts = items.map(i => i.post).filter(Boolean);
    res.json({ posts });
  } catch (err) { next(err); }
};
