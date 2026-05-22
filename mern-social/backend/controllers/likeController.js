const Like = require('../models/Like');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

exports.likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    try {
      await Like.create({ post: post._id, user: req.user._id });
      await Post.updateOne({ _id: post._id }, { $inc: { likesCount: 1 } });
      if (String(post.author) !== String(req.user._id)) {
        await Notification.create({
          recipient: post.author,
          sender: req.user._id,
          type: 'like',
          post: post._id,
        });
      }
    } catch (e) {
      if (e.code === 11000) {
        const fresh = await Post.findById(post._id).select('likesCount');
        return res.json({ liked: true, likesCount: fresh.likesCount });
      }
      throw e;
    }
    const fresh = await Post.findById(post._id).select('likesCount');
    res.json({ liked: true, likesCount: fresh.likesCount });
  } catch (err) { next(err); }
};

exports.unlikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    const removed = await Like.findOneAndDelete({ post: post._id, user: req.user._id });
    if (removed) {
      await Post.updateOne({ _id: post._id }, { $inc: { likesCount: -1 } });
    }
    const fresh = await Post.findById(post._id).select('likesCount');
    res.json({ liked: false, likesCount: Math.max(0, fresh.likesCount) });
  } catch (err) { next(err); }
};
