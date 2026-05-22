const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Follow = require('../models/Follow');

function serverUrl(req) {
  return process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
}

async function attachAuthor(post) {
  return post.populate('author', 'username name avatar');
}

exports.createPost = async (req, res, next) => {
  try {
    const text = (req.body.text || '').trim();
    if (!text && !req.file) return res.status(400).json({ message: 'Post must have text or image' });
    if (text.length > 2000) return res.status(400).json({ message: 'Text too long' });

    const image = req.file ? `${serverUrl(req)}/uploads/${req.file.filename}` : '';
    const post = await Post.create({ author: req.user._id, text, image });
    const populated = await Post.findById(post._id).populate('author', 'username name avatar');
    res.status(201).json({ post: populated });
  } catch (err) { next(err); }
};

exports.getFeed = async (req, res, next) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 10, 1), 30);
    const skip = (page - 1) * limit;

    let filter = {};
    if (req.user) {
      const following = await Follow.find({ follower: req.user._id }).select('following');
      const ids = following.map((f) => f.following).concat(req.user._id);
      // Show following + self, fall back to global if user follows nobody.
      if (ids.length > 1) filter = { author: { $in: ids } };
    }

    const [posts, total] = await Promise.all([
      Post.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('author', 'username name avatar'),
      Post.countDocuments(filter),
    ]);
    res.json({ posts, page, hasMore: skip + posts.length < total });
  } catch (err) { next(err); }
};

exports.getUserPosts = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const page = Math.max(parseInt(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit) || 12, 1), 30);
    const skip = (page - 1) * limit;

    const [posts, total] = await Promise.all([
      Post.find({ author: user._id }).sort({ createdAt: -1 }).skip(skip).limit(limit).populate('author', 'username name avatar'),
      Post.countDocuments({ author: user._id }),
    ]);
    res.json({ posts, page, hasMore: skip + posts.length < total });
  } catch (err) { next(err); }
};

exports.getPost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('author', 'username name avatar');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    let liked = false, saved = false;
    if (req.user) {
      const Like = require('../models/Like');
      const SavedPost = require('../models/SavedPost');
      [liked, saved] = await Promise.all([
        Like.exists({ post: post._id, user: req.user._id }).then(Boolean),
        SavedPost.exists({ post: post._id, user: req.user._id }).then(Boolean),
      ]);
    }
    res.json({ post, liked, saved });
  } catch (err) { next(err); }
};

exports.updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (String(post.author) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });

    if (typeof req.body.text === 'string') post.text = req.body.text.slice(0, 2000);
    if (req.file) post.image = `${serverUrl(req)}/uploads/${req.file.filename}`;
    await post.save();
    const populated = await Post.findById(post._id).populate('author', 'username name avatar');
    res.json({ post: populated });
  } catch (err) { next(err); }
};

exports.deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    if (String(post.author) !== String(req.user._id)) return res.status(403).json({ message: 'Forbidden' });
    await Post.deleteOne({ _id: post._id });
    await Comment.deleteMany({ post: post._id });
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
};
