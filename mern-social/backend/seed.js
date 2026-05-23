/**
 * Seed sample users and posts.
 * Usage:  node seed.js        (keeps existing data)
 *         node seed.js --reset (wipes Users, Posts, Comments, Follows, Likes, Saves, Notifications)
 */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const User = require('./models/User');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const Follow = require('./models/Follow');
const Like = require('./models/Like');
const SavedPost = require('./models/SavedPost');
const Notification = require('./models/Notification');

const RESET = process.argv.includes('--reset');

const USERS = [
  { username: 'ada',     email: 'ada@pulse.dev',     password: 'password123', name: 'Ada Lovelace',  bio: 'First programmer. Tinkering with engines.' },
  { username: 'linus',   email: 'linus@pulse.dev',   password: 'password123', name: 'Linus Torvalds', bio: 'I just like kernels.' },
  { username: 'grace',   email: 'grace@pulse.dev',   password: 'password123', name: 'Grace Hopper',  bio: 'Compilers, ships, and nanoseconds.' },
  { username: 'alan',    email: 'alan@pulse.dev',    password: 'password123', name: 'Alan Turing',   bio: 'Thinking about thinking machines.' },
  { username: 'margaret',email: 'margaret@pulse.dev',password: 'password123', name: 'Margaret Hamilton', bio: 'Software took us to the moon.' },
];

const POSTS = [
  'Just shipped a new feature 🚀 Feels good.',
  'Coffee + code = the perfect Saturday.',
  'Reminder: write tests before you regret it.',
  'Reading about distributed systems today. Brain melting.',
  'Hot take: dark mode is a feature, not a vibe.',
  'A small commit a day keeps the bugs away.',
  'Designing for mobile first is non-negotiable in 2026.',
  'Spent the morning refactoring. Worth it.',
];

(async () => {
  await connectDB();

  if (RESET) {
    console.log('⚠️  Resetting collections…');
    await Promise.all([
      User.deleteMany({}), Post.deleteMany({}), Comment.deleteMany({}),
      Follow.deleteMany({}), Like.deleteMany({}), SavedPost.deleteMany({}),
      Notification.deleteMany({}),
    ]);
  }

  const users = [];
  for (const u of USERS) {
    let user = await User.findOne({ username: u.username });
    if (!user) {
      user = await User.create(u);
      console.log('  ✓ user', u.username);
    }
    users.push(user);
  }

  // Posts
  for (let i = 0; i < POSTS.length; i++) {
    const author = users[i % users.length];
    const exists = await Post.findOne({ author: author._id, text: POSTS[i] });
    if (!exists) {
      await Post.create({ author: author._id, text: POSTS[i] });
      console.log('  ✓ post by', author.username);
    }
  }

  // Follow graph: everyone follows the next person
  for (let i = 0; i < users.length; i++) {
    const a = users[i]; const b = users[(i + 1) % users.length];
    try {
      await Follow.create({ follower: a._id, following: b._id });
      await User.updateOne({ _id: a._id }, { $inc: { followingCount: 1 } });
      await User.updateOne({ _id: b._id }, { $inc: { followersCount: 1 } });
    } catch { /* unique index — already exists */ }
  }

  console.log('\n✅ Seed complete.');
  console.log('   Login with any of:');
  USERS.forEach(u => console.log(`   • ${u.email}  /  ${u.password}`));
  await mongoose.disconnect();
  process.exit(0);
})().catch(err => { console.error(err); process.exit(1); });
