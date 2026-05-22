const User = require('../models/User');
const Post = require('../models/Post');

exports.search = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q) return res.json({ users: [], posts: [] });
    const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const rx = new RegExp(safe, 'i');

    const [users, posts] = await Promise.all([
      User.find({ $or: [{ username: rx }, { name: rx }] }).limit(15),
      Post.find({ text: rx }).sort({ createdAt: -1 }).limit(20).populate('author', 'username name avatar'),
    ]);
    res.json({ users: users.map(u => u.toPublicJSON()), posts });
  } catch (err) { next(err); }
};
