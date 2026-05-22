const Notification = require('../models/Notification');

exports.list = async (req, res, next) => {
  try {
    const notifs = await Notification.find({ recipient: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50)
      .populate('sender', 'username name avatar')
      .populate('post', '_id text image');
    res.json({ notifications: notifs });
  } catch (err) { next(err); }
};

exports.unreadCount = async (req, res, next) => {
  try {
    const count = await Notification.countDocuments({ recipient: req.user._id, read: false });
    res.json({ count });
  } catch (err) { next(err); }
};

exports.markAllRead = async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user._id, read: false }, { $set: { read: true } });
    res.json({ message: 'All marked read' });
  } catch (err) { next(err); }
};
