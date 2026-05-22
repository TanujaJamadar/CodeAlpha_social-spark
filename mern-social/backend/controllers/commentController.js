const Comment = require('../models/Comment');
const Post = require('../models/Post');
const Notification = require('../models/Notification');

exports.listForPost = async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .sort({ createdAt: -1 })
      .populate('author', 'username name avatar');
    res.json({ comments });
  } catch (err) { next(err); }
};

exports.addComment = async (req, res, next) => {
  try {
    const text = (req.body.text || '').trim();
    if (!text) return res.status(400).json({ message: 'Comment cannot be empty' });
    if (text.length > 500) return res.status(400).json({ message: 'Comment too long' });

    const post = await Post.findById(req.params.postId);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = await Comment.create({ post: post._id, author: req.user._id, text });
    await Post.updateOne({ _id: post._id }, { $inc: { commentsCount: 1 } });
    if (String(post.author) !== String(req.user._id)) {
      await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: 'comment',
        post: post._id,
        text: text.slice(0, 140),
      });
    }
    const populated = await Comment.findById(comment._id).populate('author', 'username name avatar');
    res.status(201).json({ comment: populated });
  } catch (err) { next(err); }
};

exports.deleteComment = async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const post = await Post.findById(comment.post);
    const isAuthor = String(comment.author) === String(req.user._id);
    const isPostOwner = post && String(post.author) === String(req.user._id);
    if (!isAuthor && !isPostOwner) return res.status(403).json({ message: 'Forbidden' });

    await Comment.deleteOne({ _id: comment._id });
    if (post) await Post.updateOne({ _id: post._id }, { $inc: { commentsCount: -1 } });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
