const User = require('../models/User');
const Follow = require('../models/Follow');
const Notification = require('../models/Notification');
const path = require('path');

function publicUrl(req, filename) {
  const base = process.env.SERVER_URL || `${req.protocol}://${req.get('host')}`;
  return `${base}/uploads/${filename}`;
}

exports.getProfile = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) return res.status(404).json({ message: 'User not found' });

    let isFollowing = false;
    if (req.user && String(req.user._id) !== String(user._id)) {
      isFollowing = !!(await Follow.exists({ follower: req.user._id, following: user._id }));
    }
    res.json({ user: user.toPublicJSON(), isFollowing, isSelf: req.user && String(req.user._id) === String(user._id) });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const updates = {};
    ['name', 'bio'].forEach((k) => {
      if (typeof req.body[k] === 'string') updates[k] = req.body[k].slice(0, k === 'bio' ? 250 : 60);
    });
    if (req.file) updates.avatar = publicUrl(req, req.file.filename);

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    res.json({ user: user.toPublicJSON() });
  } catch (err) { next(err); }
};

exports.followUser = async (req, res, next) => {
  try {
    const target = await User.findOne({ username: req.params.username });
    if (!target) return res.status(404).json({ message: 'User not found' });
    if (String(target._id) === String(req.user._id)) {
      return res.status(400).json({ message: "You can't follow yourself" });
    }
    try {
      await Follow.create({ follower: req.user._id, following: target._id });
      await User.updateOne({ _id: target._id }, { $inc: { followersCount: 1 } });
      await User.updateOne({ _id: req.user._id }, { $inc: { followingCount: 1 } });
      await Notification.create({
        recipient: target._id,
        sender: req.user._id,
        type: 'follow',
      });
    } catch (e) {
      if (e.code === 11000) return res.status(200).json({ message: 'Already following' });
      throw e;
    }
    res.json({ message: 'Followed', isFollowing: true });
  } catch (err) { next(err); }
};

exports.unfollowUser = async (req, res, next) => {
  try {
    const target = await User.findOne({ username: req.params.username });
    if (!target) return res.status(404).json({ message: 'User not found' });

    const deleted = await Follow.findOneAndDelete({ follower: req.user._id, following: target._id });
    if (deleted) {
      await User.updateOne({ _id: target._id }, { $inc: { followersCount: -1 } });
      await User.updateOne({ _id: req.user._id }, { $inc: { followingCount: -1 } });
    }
    res.json({ message: 'Unfollowed', isFollowing: false });
  } catch (err) { next(err); }
};

exports.suggestedUsers = async (req, res, next) => {
  try {
    const me = req.user._id;
    const following = await Follow.find({ follower: me }).select('following');
    const exclude = following.map((f) => f.following).concat(me);
    const users = await User.find({ _id: { $nin: exclude } })
      .sort({ followersCount: -1, createdAt: -1 })
      .limit(8);
    res.json({ users: users.map((u) => u.toPublicJSON()) });
  } catch (err) { next(err); }
};

exports.exploreUsers = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    const filter = q
      ? { $or: [{ username: new RegExp(q, 'i') }, { name: new RegExp(q, 'i') }] }
      : {};
    const users = await User.find(filter).sort({ followersCount: -1 }).limit(30);

    let followingSet = new Set();
    if (req.user) {
      const rels = await Follow.find({ follower: req.user._id, following: { $in: users.map((u) => u._id) } });
      followingSet = new Set(rels.map((r) => String(r.following)));
    }
    res.json({
      users: users.map((u) => ({
        ...u.toPublicJSON(),
        isFollowing: followingSet.has(String(u._id)),
      })),
    });
  } catch (err) { next(err); }
};
